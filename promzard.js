module.exports = promzard
promzard.PromZard = PromZard

var fs = require('fs')
var vm = require('vm')
var util = require('util')
var files = {}
var crypto = require('crypto')
var Stream = require('stream').Stream
var tty = require('tty')
var read = require('read')

var Module = require('module').Module
var path = require('path')

function promzard (file, ctx, cb) {
  if (typeof ctx === 'function') cb = ctx, ctx = null;
  if (!ctx) ctx = {};
  var pz = new PromZard(file, ctx)
  pz.on('error', cb)
  pz.on('data', function (data) {
    cb(null, JSON.parse(data))
  })
}

function PromZard (file, ctx) {
  if (!(this instanceof PromZard))
    return new PromZard(file, ctx)
  Stream.call(this)
  this.readable = true
  this.writable = true
  this.file = file
  this.ctx = ctx
  this.unique = crypto.randomBytes(8).toString('hex')
  this.on('pipe', function (src) {
    // write output to dest
    this.src = src
    this.loaded()
  })

  // when finished, don't leave the terminal raw
  this.on('error', this.unsetRaw)
  this.on('data', this.unsetRaw)

  this.load()
}

PromZard.prototype = Object.create(
  Stream.prototype,
  { constructor: {
      value: PromZard,
      readable: true,
      configurable: true,
      writable: true,
      enumerable: false } } )

PromZard.prototype.unsetRaw = function () {
  this.setRaw(this.wasRaw || false)
}

PromZard.prototype.setRaw = function (f) {
  if (this.src.isRaw &&
      this.wasRaw === undefined)
    this.wasRaw = this.src.isRaw()
  else
    this.wasRaw = true

  if (f !== false)
    f = true

  var current = this.src.isRaw ? this.src.isRaw() : NaN
  if (f === current)
    return

  if (this.src.setRawMode)
    this.src.setRawMode(f)
  else if (this.src === process.stdin)
    tty.setRawMode(f)
}

PromZard.prototype.load = function () {
  console.error('load')
  if (files[this.file])
    return this.loaded()

  fs.readFile(this.file, 'utf8', function (er, d) {
    if (er)
      return this.emit('error', er)
    files[this.file] = d
    this.loaded()
  }.bind(this))
}

PromZard.prototype.pipe = function (dest) {
  console.error('pipe')
  this.dest = dest
  this.loaded()
  Stream.prototype.pipe.call(this, dest)
}

PromZard.prototype.checkStreams = function () {
  // if the output is stdout, then write prompts to
  // stderr.
  if (!this.src || !this.dest)
    return

  // write prompts to stdout by default
  if (!this.promptStream)
    this.promptStream = process.stdout

  // unless that's where we're also writing the data
  if (this.promptStream === this.dest)
    switch (this.dest) {
      case process.stdout:
        this.promptStream = process.stderr
        break
      case process.stderr:
        this.promptStream = process.stdout
        break
      default:
        return this.emit('error', new Error('crossing the streams'))
    }

  this.setRaw()
}

PromZard.prototype.loaded = function () {
  if (!files[this.file] ||
      !this.src ||
      !this.dest)
    return

  console.error('loaded')
  this.checkStreams()

  this.ctx.prompt = this.makePrompt()
  this.ctx.__filename = this.file
  this.ctx.__dirname = path.dirname(this.file)
  this.ctx.__basename = path.basename(this.file)
  var mod = this.ctx.module = this.makeModule()
  this.ctx.require = function (path) {
    return mod.require(path)
  }
  this.ctx.require.resolve = function(path) {
    return Module._resolveFilename(path, mod);
  }
  this.ctx.exports = mod.exports

  this.script = this.wrap(files[this.file])
  console.error('got the script', this.script)
  var fn = vm.runInThisContext(this.script, this.file)
  console.error('got the fn')
  var args = Object.keys(this.ctx).map(function (k) {
    return this.ctx[k]
  }.bind(this))
  this.result = fn.apply(this.ctx, args)
  console.error('result', this.result)
  this.walk()
}

PromZard.prototype.makeModule = function (path) {
  var mod = new Module(path, module)
  mod.loaded = true
  mod.filename = this.file
  return mod
}

PromZard.prototype.wrap = function (body) {
  var s = '(function( %s ) { return %s\n })'
  var args = Object.keys(this.ctx).join(',')
  return util.format(s, args, body)
}

PromZard.prototype.makePrompt = function () {
  this.prompts = []
  return prompt.bind(this)
  function prompt () {
    var p, d, t
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i]
      if (typeof a === 'string' && p)
        d = a
      else if (typeof a === 'string')
        p = a
      else if (typeof a === 'function')
        t = a
    }

    try { return this.unique + '-' + this.prompts.length }
    finally { this.prompts.push([p, d, t]) }
  }
}

PromZard.prototype.walk = function (o, cb) {
  o = o || this.result
  cb = cb || function (er, res) {
    if (er)
      return this.emit('error', er)
    this.result = res
    return this.emit('data', res)
  }
  cb = cb.bind(this)
  var keys = Object.keys(o)
  var i = 0
  var len = keys.length

  console.error('walk', o, keys)
  L.call(this)
  function L () {
    while (i < len) {
      var k = keys[i]
      var v = o[k]
      i++
      console.error('walk', o, k, v)

      if (v && typeof v === 'object') {
        return this.walk(v, function (er, res) {
          if (er) return cb(er)
          o[k] = res
          L.call(this)
        }.bind(this))
      } else if (v &&
                 typeof v === 'string' &&
                 v.indexOf(this.unique) === 0) {
        var n = +v.substr(this.unique.length + 1)
        var prompt = this.prompts[n]
        if (isNaN(n) || !prompt)
          continue

        // default to the key
        if (undefined === prompt[0])
          prompt[0] = k

        return this.prompt(prompt, function (er, res) {
          o[k] = res
          L.call(this)
        }.bind(this))
      }
    }
    // made it to the end of the loop, maybe
    if (i >= len)
      return cb(null, o)
  }
}

PromZard.prototype.prompt = function (pdt, cb) {
  var prompt = pdt[0]
  var def = pdt[1]
  var tx = pdt[2]

  if (tx)
    cb = function (cb) { return function (er, data) {
      return cb(er, data ? tx(data) : null)
    }}(cb)

  read({ prompt: prompt + ': ' , default: def }, cb)
}

