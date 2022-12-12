/* globals prompt, basename */

const fs = require('fs/promises')

module.exports = {
  name: basename.replace(/^node-/, ''),
  version: '0.0.0',
  description: (function () {
    let value
    try {
      const src = fs.readFileSync('README.markdown', 'utf8')
      value = src.split('\n')
        .find((l) => /\s+/.test(l) && l.trim() !== basename.replace(/^node-/, ''))
        .trim()
        .replace(/^./, c => c.toLowerCase())
        .replace(/\.$/, '')
    } catch {
      // no value
    }
    return prompt('description', value)
  })(),
  main: prompt('entry point', 'index.js'),
  bin: async function () {
    const exists = await fs.stat('bin/cmd.js')
      .then(() => true)
      .catch(() => false)
    return exists ? {
      [basename.replace(/^node-/, '')]: 'bin/cmd.js',
    } : undefined
  },
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
    url: 'git://github.com/substack/' + basename + '.git',
  },
  homepage: 'https://github.com/substack/' + basename,
  keywords: prompt((s) => s.split(/\s+/)),
  author: {
    name: 'James Halliday',
    email: 'mail@substack.net',
    url: 'http://substack.net',
  },
  license: 'MIT',
  engine: { node: '>=0.6' },
}
