var Yaff  = require('yaff');
var maybe = require('maybe2');
var log   = console.log;

var Yantr = module.exports = function Yantr(tasks) {
  if (!(this instanceof Yantr))
    return new Yantr(tasks);
  this.tasks = maybe(tasks).is(Array).getOrElse([]);
  this.index = this.tasks.reduce(function (index, task) {
    return maybe(task.tags).map(function (tags) {
      tags.forEach(function (tag) {
        if(!index[tag])
          index[tag] = [];
        index[tag].push(task);
      });
    }).getOrElse(index);
  }, {});
};

Yantr.prototype.run = function (cb) {
  var self = this;
  Yaff(this.tasks).parEach(function (task) {
      self.__taskExecutor(task, this);
    }).finally(cb);
};

Yantr.prototype.__isDone = function (tag, cb) {
  var self = this;
  var done = this.index[tag].every(function (task) {
    return task.done;
  });
  if (done)
    return cb();
  setImmediate(function () {
    self.__isDone(tag, cb);
  });
};

Yantr.prototype.__taskExecutor = function (task, cb) {
  (function (task, self) {
    Yaff(task.depends || []).parEach(function (dependency) {
        self.__isDone(dependency, this);
      }).seq(function () {
        task.task(this);
      }).seq(function () {
        task.done = true;
        this();
      }).finally(cb);
  })(task, this);
};
