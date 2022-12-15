const t = require('tap')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child('file does not exist')
}

t.test('backup file', async (t) => {
  t.match(await setup(__filename), 'ENOENT')
})
