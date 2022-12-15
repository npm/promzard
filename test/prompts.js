const t = require('tap')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

t.test('prompts', async (t) => {
  const output = await setup(__filename, ['', '', ''])

  t.same(JSON.parse(output), {
    a: 'a',
    b: 'a',
    c: 'c',
  })
})
