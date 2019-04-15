var test = require('tap').test;
var promzard = require('..')
var inputFile = require.resolve('./error.input')

test('no data on error', function (t) {
  promzard(inputFile, function (err) {
      if (err) t.type(err, Error)
      else t.fail('`data` must not be fired on error')
  })

  setTimeout(function () { t.end() }, 10)
})
