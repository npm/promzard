const { test } = require('node:test')
const assert = require('node:assert')
const { setup, child, isChild, getFixture } = require('./fixtures/setup')

if (isChild()) {
  return child('file does not exist', { tmpdir: '/tmp' }, { backupFile: getFixture('simple') })
}

test('backup file', async () => {
  const output = await setup(__filename, ['', '55', 'no'])

  assert.deepStrictEqual(JSON.parse(output), {
    a: 3,
    b: '!2b',
    c: {
      x: '55',
      y: '/tmp/y/file.txt',
    },
    error: 'no',
  })
})
