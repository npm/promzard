const t = require('tap')
const { setup, child, isChild } = require('./fixtures/setup')

if (isChild()) {
  return child(__filename, { basename: 'node-example' })
}

t.test('run the example', async (t) => {
  const output = await setup(__filename, [
    'testing description',
    'test-entry.js',
    'fugazi function waiting room',
  ])

  t.same(JSON.parse(output), {
    name: 'example',
    version: '0.0.0',
    description: 'testing description',
    main: 'test-entry.js',
    directories: {
      example: 'example',
      test: 'test',
    },
    dependencies: {},
    devDependencies: {
      tap: '~0.2.5',
    },
    scripts: {
      test: 'tap test/*.js',
    },
    repository: {
      type: 'git',
      url: 'git://github.com/substack/node-example.git',
    },
    homepage: 'https://github.com/substack/node-example',
    keywords: [
      'fugazi',
      'function',
      'waiting',
      'room',
    ],
    author: {
      name: 'James Halliday',
      email: 'mail@substack.net',
      url: 'http://substack.net',
    },
    license: 'MIT',
    engine: {
      node: '>=0.6',
    },
  })
})
