
const t = require('tap')
const { setup: _setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

const setup = (...args) => _setup(__filename, args).then(JSON.parse)

t.test('conditional', async (t) => {
  t.same(await setup(''), {})
  t.same(await setup('a'), {})
  t.same(await setup('git', ''), {})
  t.same(await setup('git', 'http'), {
    repository: {
      type: 'git',
      url: 'http',
    },
  })
  t.same(await setup('svn', 'http'), {
    repository: {
      type: 'svn',
      url: 'http',
    },
  })
})
