const { test } = require('node:test')
const assert = require('node:assert')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename, { tmpdir: '/tmp' })
}

test('exports', async () => {
  const output = await setup(__filename, ['', '55'])

  assert.deepStrictEqual(JSON.parse(output), {
    a: 3,
    b: '!2b',
    c: {
      x: '55',
      y: '/tmp/y/file.txt',
    },
  })
})
