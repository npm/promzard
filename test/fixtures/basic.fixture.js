/* globals prompt, basename */

const fs = require('fs/promises')
const path = require('path')

module.exports = {
  name: basename.replace(/^node-/, ''),
  version: '0.0.0',
  description: async () => {
    const value = await fs.readFile('README.markdown', 'utf8')
      .then((src) => src.split('\n')
        .find((l) => /\s+/.test(l) && l.trim() !== basename.replace(/^node-/, ''))
        .trim()
        .replace(/^./, c => c.toLowerCase())
        .replace(/\.$/, ''))
      .catch(() => null)
    return prompt('description', value)
  },
  main: prompt('entry point', 'index.js'),
  resolved: () => {
    try {
      return path.basename(require.resolve('../../'))
    } catch {
      return 'error'
    }
  },
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
