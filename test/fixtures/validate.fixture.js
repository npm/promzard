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
}
