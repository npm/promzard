const t = require('tap')
const { setup: _setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename, { tmpdir: '/tmp' })
}

const setup = (...args) => _setup(__filename, args)

t.test('simple', async (t) => {
  t.same(await setup('', '55', 'no error').then(JSON.parse), {
    a: 3,
    b: '!2b',
    c: {
      x: 55,
      y: '/tmp/y/file.txt',
    },
    error: 'no error',
  })

  t.match(await setup('', '55', 'throw'), /Error: this is unexpected/)
})
