var pz = require('../promzard')

var path = require('path')
var file = path.resolve(__dirname, 'substack.json')
var ctx = { basename: path.basename(path.dirname(file)) }

pz(file, ctx, function (er, res) {
  if (er)
    throw er
  console.log(JSON.stringify(res, null, 2))
})
