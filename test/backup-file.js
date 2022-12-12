const t = require('tap')
const { setup, child, isChild, getFixture } = require('./fixtures/setup')

if (isChild()) {
  return child('file does not exist', { tmpdir: '/tmp' }, { backupFile: getFixture('simple') })
}

t.test('backup file', async (t) => {
  const output = await setup(__filename, ['', '55'])

  t.same(JSON.parse(output), {
    a: 3,
    b: '!2b',
    c: {
      x: 55,
      y: '/tmp/y/file.txt',
    },
  })
})
