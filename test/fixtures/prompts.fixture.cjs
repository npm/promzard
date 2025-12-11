/* globals prompt */

const transform = (a) => a

module.exports = {
  a: prompt({
    prompt: 'a',
    default: 'a',
    transform,
  }),
  b: prompt('b', 'b', () => 'b', {
    prompt: 'a',
    default: 'a',
    transform,
  }),
  c: prompt('c', 'c', transform, {}),
}
