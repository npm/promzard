/* globals prompt, tmpdir */

module.exports = {
  a: 1 + 2,
  b: prompt('To be or not to be?', '!2b'),
  c: {
    x: prompt(),
    y: tmpdir + '/y/file.txt',
  },
}
