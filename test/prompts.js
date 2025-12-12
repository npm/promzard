const { test } = require('node:test')
const assert = require('node:assert')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

test('prompts', async () => {
  const output = await setup(__filename, ['', '', ''])

  assert.deepStrictEqual(JSON.parse(output), {
    a: 'a',
    b: 'a',
    c: 'c',
  })
})
