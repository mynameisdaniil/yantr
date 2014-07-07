yantr
=====

Yet Another Node Task Runner

This library is about dependent tasks and their resolution in correct order.

Constructor expects a collection of task objects. Task object basically just a plain js object with `tags`, `depends` and `payload` fields; `tags` - array of tags belong to this object, `depends` - tags on what this object is dependent, `payload` - async function with one callback argument. You should call callback in order to mark this task as done. Execution of tasks stops immediately if you provide an error to the callback.

E.g.

```javascript
var Yantr = require('./index.js');

var tasks = [
  {
    depends: ['test'],
    tags: [],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
  {
    depends: [],
    tags: ['test', 'hello'],
    payload: function (cb) {
      log('Hello');
      cb();
    }
  },
  {
    depends: ['hello', 'space'],
    tags: ['test', 'world'],
    payload: function (cb) {
      log('world!');
      cb();
    }
  },
  {
    depends: ['hello'],
    tags: ['test', 'space'],
    payload: function (cb) {
      log('_');
      cb();
    }
  },
  {
    depends: ['hello', 'space', 'world'],
    tags: [],
    payload: function (cb) {
      log('Hello world!');
      cb();
    }
  },
];

Yantr(tasks).run(function (e) {
  log(e? e:'Done!');
});

```
