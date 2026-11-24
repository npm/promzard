const Module = require('module')
const t = require('tap')

const load = Module._load
Module._load = (request, ...args) => request === 'read'
  ? { read: async () => '' }
  : load(request, ...args)
const PromZard = require('../lib')
Module._load = load

t.test('context property names cannot inject parameters', async (t) => {
  const result = await PromZard.fromBuffer(
    Buffer.from('module.exports = { answer }'),
    { answer: 42 }
  )
  t.same(result, { answer: 42 })

  const unicodeResult = await PromZard.fromBuffer(
    Buffer.from('module.exports = { café }'),
    { café: 24 }
  )
  t.same(unicodeResult, { café: 24 })

  const key = 'value) { globalThis.__promzardInjected = true } //'
  const originalRandom = Math.random
  Math.random = () => 0.123
  try {
    await t.rejects(
      PromZard.fromBuffer(
        Buffer.from('module.exports = {}'),
        { [key]: 'ignored' }
      ),
      { name: 'TypeError', message: /valid JavaScript identifiers/ }
    )
    await t.rejects(
      PromZard.fromBuffer(
        Buffer.from('module.exports = {}'),
        { [key]: 'ignored' }
      ),
      { name: 'TypeError', message: /valid JavaScript identifiers/ }
    )
  } finally {
    Math.random = originalRandom
  }
  t.equal(global.__promzardInjected, undefined)
})
