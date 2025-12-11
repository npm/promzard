const { test } = require('node:test')
const assert = require('node:assert')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child('file does not exist')
}

test('backup file', async () => {
  assert.match(await setup(__filename), /ENOENT/)
})
