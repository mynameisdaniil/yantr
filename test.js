var log = console.log;

var Yantr = require('./index.js');

var tasks = [
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
  {
    name: 'hello tags',
    depends: ['test'],
    tags: [],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  }
];

Yantr(tasks).run(function () {
  log(arguments);
  log('Done!');
});
