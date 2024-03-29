
const t = require('tap')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

t.test('validate', async (t) => {
  const output = await setup(__filename, [
    [/name: $/, 'not cool'],
    [/name: $/, 'cool'],
    [/name2: $/, 'not cool'],
    [/name2: $/, 'cool'],
  ])

  t.same(JSON.parse(output), { name: 'cool', name2: 'cool' })
})
