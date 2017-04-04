var test = require('tap').test;
var promzard = require('../');

test('noprompt', function (t) {
    t.plan(1);
    
    var ctx = { tmpdir : '/tmp', noprompt: true }
    var file = __dirname + '/noprompt.input';
    promzard(file, ctx, function (err, output) {
        t.same(
            {
                a : 3,
                b : '!2b',
                c : {
                    x : '',
                    y : '/tmp/y/file.txt',
                }
            },
            output
        );
    });
});
