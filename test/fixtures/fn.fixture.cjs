/* globals prompt, tmpdir */

const fs = require('fs/promises')

module.exports = {
  a: 1 + 2,
  b: prompt('To be or not to be?', '!2b', (s) => s.toUpperCase() + '...'),
  c: {
    x: prompt((x) => x * 100),
    y: tmpdir + '/y/file.txt',
  },
  a_function: () => fs.readFile(__filename, 'utf8'),
  asyncPrompt: async () => {
    await new Promise(r => setTimeout(r, 100))
    return prompt('a prompt at any other time would smell as sweet')
  },
  cbPrompt: (cb) => {
    setTimeout(() => {
      cb(null, prompt('still works with callbacks'))
    }, 100)
  },
}
