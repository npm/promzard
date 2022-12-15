const { spawn } = require('child_process')
const { readFile } = require('fs/promises')
const path = require('path')
const promzard = require('../../')

const CHILD = 'child'

const isChild = () => process.argv[2] === CHILD

const setup = async (file, writes = []) => {
  const proc = spawn(process.execPath, [file, CHILD])
  const entries = Array.isArray(writes) ? writes : Object.entries(writes)

  let i = 0
  let output = ''

  proc.stderr.on('data', (c) => output += c)
  proc.stdout.on('data', (c) => {
    let write = entries[i]
    if (Array.isArray(write)) {
      if (write[0].test(c.toString())) {
        write = write[1]
      } else {
        return
      }
    }
    i++
    process.nextTick(() => proc.stdin[writes.length === i ? 'end' : 'write'](`${write}\n`))
  })

  await new Promise(res => proc.on('close', res))

  return output
}

const getFixture = (f) => path.join(__dirname, path.basename(f, '.js') + '.fixture.js')

async function child (f, ctx, options) {
  const output = await promzard(getFixture(f), ctx, options)
  console.error(JSON.stringify(output))
}

async function childBuffer (f, ctx, options) {
  const buf = await readFile(getFixture(f))
  const output = await promzard.fromBuffer(buf, ctx, options)
  console.error(JSON.stringify(output))
}

module.exports = { setup, child, childBuffer, isChild, getFixture }
