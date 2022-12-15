/* globals prompt */

module.exports = {
  repository: {
    type: prompt('repo type'),
    url () {
      if (['git', 'svn'].includes(this.res.repository.type)) {
        return prompt(`${this.res.repository.type} url`)
      }
    },
  },
  // this name of this doesnt matter, just that it comes last
  '' () {
    if (!this.res.repository.type || !this.res.repository.url) {
      delete this.res.repository
    }
  },
}
