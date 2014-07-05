var log = console.log;

var Yantr = require('./index.js');

var tasks = [
  {
    id: 0,
    depends: ['test'],
    tags: [],
    payload: function (cb) {
      log('Hello tags!');
      cb();
    }
  },
  {
    id: 1,
    depends: [],
    tags: ['test', 'hello'],
    payload: function (cb) {
      log('Hello');
      cb();
    }
  },
  {
    id: 2,
    depends: ['hello', 'space'],
    tags: ['test', 'world'],
    payload: function (cb) {
      log('world!');
      cb();
    }
  },
  {
    id: 3,
    depends: ['hello'],
    tags: ['test', 'space'],
    payload: function (cb) {
      log('_');
      cb();
    }
  },
  {
    id: 4,
    depends: ['hello', 'space', 'world'],
    tags: [],
    payload: function (cb) {
      log('Hello world!');
      cb();
    }
  },
];

Yantr(tasks).run(function () {
  log(arguments);
  log('Done!');
});
