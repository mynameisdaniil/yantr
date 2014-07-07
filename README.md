Yantr
=====

Yet Another Node Task Runner

This library is about dependent tasks and their resolution in correct order.

Constructor expects a collection of task objects. Task object basically just a plain js object with `tags`, `depends` and `payload` fields; `tags` - array of tags belong to this object, `depends` - tags on what this object is dependent, `payload` - async function with one callback argument. You should call callback in order to mark current task as done. Execution stops immediately if you provide error to the callback.

To start execution you should call `run` method on constructed `Yantr` object. `run` expects callback as its single argument. If error occurs during execution it will be passed to the callback. `Yantr` also checks provided graph for cyclic dependencies and generates error if any.

Notice that you should have at least one task without dependencies in order be able to resolve dependency tree.
E.g.

```javascript
var Yantr = require('./index.js');

var tasks = [
  {
    tags: [],
    depends: ['test'],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
  {
    tags: ['test', 'hello'],
    depends: [],
    payload: function (cb) {
      log('Hello');
      cb();
    }
  },
  {
    tags: ['test', 'world'],
    depends: ['hello', 'space'],
    payload: function (cb) {
      log('world!');
      cb();
    }
  },
  {
    tags: ['test', 'space'],
    depends: ['hello'],
    payload: function (cb) {
      log('_');
      cb();
    }
  },
  {
    tags: [],
    depends: ['hello', 'space', 'world'],
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


Following code will generate error because of circular dependencies:
```javascript
var tasks = [
  {
    tags: ['A'],
    depends: ['B'],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
  {
    tags: ['B'],
    depends: ['C'],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
  {
    tags: ['C'],
    depends: ['A'],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
];

```
