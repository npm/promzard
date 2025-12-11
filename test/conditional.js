const { test } = require('node:test')
const assert = require('node:assert')
const { setup: _setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename)
}

const setup = (...args) => _setup(__filename, args).then(JSON.parse)

test('conditional', async () => {
  assert.deepStrictEqual(await setup(''), {})
  assert.deepStrictEqual(await setup('a'), {})
  assert.deepStrictEqual(await setup('git', ''), {})
  assert.deepStrictEqual(await setup('git', 'http'), {
    repository: {
      type: 'git',
      url: 'http',
    },
  })
  assert.deepStrictEqual(await setup('svn', 'http'), {
    repository: {
      type: 'svn',
      url: 'http',
    },
  })
})
