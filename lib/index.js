const fs = require('fs/promises')
const vm = require('vm')
const util = require('util')
const crypto = require('crypto')
const { Module } = require('module')
const path = require('path')
const read = require('read')

const files = {}

class PromZard {
  #file = null
  #backupFile = null
  #ctx = null
  #unique = crypto.randomBytes(8).toString('hex')
  #prompts = []

  constructor (file, ctx = {}, options = {}) {
    this.#file = file
    this.#ctx = ctx
    this.#backupFile = options.backupFile
  }

  static async promzard (file, ctx, options) {
    const pz = new PromZard(file, ctx, options)
    return pz.load()
  }

  static async fromBuffer (buf, ctx, options) {
    let filename = 0
    do {
      filename = '\0' + Math.random()
    } while (files[filename])
    files[filename] = buf
    const ret = await PromZard.promzard(filename, ctx, options)
    delete files[filename]
    return ret
  }

  async load () {
    if (files[this.#file]) {
      return this.#loaded()
    }

    try {
      const d = await fs.readFile(this.#file, 'utf8')
      files[this.#file] = d
    } catch (er) {
      if (er && this.#backupFile) {
        this.#file = this.#backupFile
        this.#backupFile = null
        return this.load()
      }
      throw er
    }

    return this.#loaded()
  }

  async #loaded () {
    const mod = new Module(this.#file, module)
    mod.loaded = true
    mod.filename = this.#file
    mod.id = this.#file
    mod.paths = Module._nodeModulePaths(path.dirname(this.#file))

    this.#ctx.prompt = this.#makePrompt()
    this.#ctx.__filename = this.#file
    this.#ctx.__dirname = path.dirname(this.#file)
    this.#ctx.__basename = path.basename(this.#file)
    this.#ctx.module = mod
    this.#ctx.require = (p) => mod.require(p)
    this.#ctx.require.resolve = (p) => Module._resolveFilename(p, mod)
    this.#ctx.exports = mod.exports

    const body = util.format(
      '(function( %s ) { %s\n })',
      Object.keys(this.#ctx).join(', '),
      files[this.#file]
    )
    const fn = vm.runInThisContext(body, this.#file)
    const args = Object.keys(this.#ctx).map((k) => this.#ctx[k])

    const output = fn.apply(this.#ctx, args)
    const res = (
      output &&
      typeof output === 'object' &&
      exports === mod.exports &&
      Object.keys(exports).length === 1
    ) ? output : mod.exports

    return this.#walk(res)
  }

  #makePrompt () {
    return (...args) => {
      let p, d, t
      for (let i = 0; i < args.length; i++) {
        const a = args[i]
        if (typeof a === 'string') {
          if (p) {
            d = a
          } else {
            p = a
          }
        } else if (typeof a === 'function') {
          t = a
        } else if (a && typeof a === 'object') {
          p = a.prompt || p
          d = a.default || d
          t = a.transform || t
        }
      }
      try {
        return `${this.#unique}-${this.#prompts.length}`
      } finally {
        this.#prompts.push([p, d, t])
      }
    }
  }

  async #walk (o) {
    const keys = Object.keys(o)

    const len = keys.length
    let i = 0

    while (i < len) {
      const k = keys[i]
      const v = o[k]
      i++

      if (v && typeof v === 'object') {
        o[k] = await this.#walk(v)
        continue
      }

      if (v && typeof v === 'string' && v.startsWith(this.#unique)) {
        const n = +v.slice(this.#unique.length + 1)
        const promptParts = this.#prompts[n]

        if (!promptParts) {
          continue
        }

        // default to the key
        // default to the ctx value, if there is one
        const [prompt = k, def = this.#ctx[k], tx] = promptParts

        try {
          o[k] = await this.#prompt(prompt, def, tx)
        } catch (er) {
          if (er.notValid) {
            console.log(er.message)
            i--
          } else {
            throw er
          }
        }
        continue
      }

      if (typeof v === 'function') {
        const fn = v.length ? util.promisify(v) : v
        o[k] = await fn.call(this.#ctx)
        // back up so that we process this one again.
        // this is because it might return a prompt() call in the cb.
        i--
        continue
      }
    }

    return o
  }

  async #prompt (prompt, def, tx) {
    let res = await read({ prompt: prompt + ':', default: def })
    if (tx) {
      res = tx(res)
    }
    if (res instanceof Error && res.notValid) {
      throw res
    }
    return res
  }
}

module.exports = PromZard.promzard
module.exports.fromBuffer = PromZard.fromBuffer
module.exports.PromZard = PromZard
