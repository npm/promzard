# promzard

A reimplementation of @SubStack's
[prompter](https://github.com/substack/node-prompter), which does not
use AST traversal.

From another point of view, it's a reimplementation of
[@Marak](https://github.com/marak)'s
[wizard](https://github.com/Marak/wizard) which doesn't use schemas.

The goal is a nice drop-in enhancement for `npm init`.

## Usage

```javascript
var promzard = require('promzard')
promzard(inputFile, optionalContextAdditions, function (er, data) {
  // .. you know what you doing ..
})
```
