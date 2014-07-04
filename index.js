var Yaff  = require('yaff');
var maybe = require('maybe2');

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
    __taskExecutor(task, self.index, this);
  }).finally(cb);
};

var __isDone = function (tag, index, cb) {
  if (index[tag].every(function (task) {
    return task.done;
  }))
    return cb();
  setImmediate(function () {
    __isDone(tag, index, cb);
  });
};

var __taskExecutor = function (task, index, cb) {
  Yaff(task.depends || []).parEach(function (tag) {
    __isDone(tag, index, this);
  }).seq(function () {
    task.payload(this);
  }).dummy(task.done = true).finally(cb);
};
