# Changelog

## [1.0.0](https://github.com/npm/promzard/compare/v0.3.0...v1.0.0) (2022-12-15)

### ⚠️ BREAKING CHANGES

* refactor module
    - all async interfaces are promise only and no longer accept a callback
    - the `PromZard` class is no longer an event emitter
    - the `load` method must be manually called after creating a class

### Features

* [`d37e442`](https://github.com/npm/promzard/commit/d37e4422075eda27a3951e8ab2f3d9f4f265a122) refactor (@lukekarrys)

### Bug Fixes

* [`3c113db`](https://github.com/npm/promzard/commit/3c113db7a1ce0f8787ec0bc98bc3b1353eeaf109) [#38](https://github.com/npm/promzard/pull/38) 100 test coverage (#38) (@lukekarrys)

### Dependencies

* [`9f2b9aa`](https://github.com/npm/promzard/commit/9f2b9aaa058472b61e4538cb4e0866b3ebfd48ff) `read@2.0.0`
