var test = require('tap').test;
var promzard = require('../');

test('prompt callback param', function (t) {
    t.plan(1);
    
    var ctx = { tmpdir : '/tmp' }
    var file = __dirname + '/fn.json';
    promzard(file, ctx, function (err, output) {
        t.same(
            {
                a : 3,
                b : '!2B...',
                c : {
                    x : 5500,
                    y : '/tmp/y/file.txt',
                }
            },
            output
        );
    });
    
    setTimeout(function () {
        process.stdin.emit('data', '\n');
    }, 100);
    
    setTimeout(function () {
        process.stdin.emit('data', '55\n');
    }, 200);
});
