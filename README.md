# promzard

A reimplementation of @SubStack's
[prompter](https://github.com/substack/node-prompter), which does not
use AST traversal.

## Usage

```javascript
var promzard = require('promzard')
promzard(inputFile, optionalContextAdditions, function (er, data) {
  // .. you know what you doing ..
})
```
