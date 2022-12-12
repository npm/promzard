
const t = require('tap')
const fs = require('fs')
const path = require('path')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename, { tmpdir: '/tmp' })
}

t.test('prompt callback param', async (t) => {
  const output = await setup(__filename, ['', '55', 'async prompt', 'cb prompt'])

  t.same(JSON.parse(output), {
    a: 3,
    b: '!2B...',
    c: {
      x: 5500,
      y: '/tmp/y/file.txt',
    },
    a_function: fs.readFileSync(path.resolve(__dirname, 'fixtures/fn.fixture.js'), 'utf8'),
    asyncPrompt: 'async prompt',
    cbPrompt: 'cb prompt',
  })
})
