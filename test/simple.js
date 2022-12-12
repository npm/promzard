const t = require('tap')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename, { tmpdir: '/tmp' })
}

t.test('simple', async (t) => {
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
