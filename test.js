var log = console.log;

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
