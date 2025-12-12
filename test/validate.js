const { test } = require('node:test')
const assert = require('node:assert')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

test('validate', async () => {
  const output = await setup(__filename, [
    [/name: $/, 'not cool'],
    [/name: $/, 'cool'],
    [/name2: $/, 'not cool'],
    [/name2: $/, 'cool'],
  ])

  assert.deepStrictEqual(JSON.parse(output), { name: 'cool', name2: 'cool' })
})
