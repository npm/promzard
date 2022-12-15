/* globals prompt */

module.exports = {
  name: prompt('name', (data) => {
    if (data === 'cool') {
      return data
    }
    return Object.assign(new Error('name must be cool'), {
      notValid: true,
    })
  }),
  name2: prompt('name2', (data) => {
    if (data === 'cool') {
      return data
    }
    throw Object.assign(new Error('name must be cool'), {
      notValid: true,
    })
  }),
}
