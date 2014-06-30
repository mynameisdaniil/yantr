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

Yantr.prototype.__taskExecutor = function (task, cb) {
  var self = this;
  if (task.exec)
    return cb();
  task.exec = true;
  Yaff(task.depends || []).parEach(function (dependency) {
    self.__execByTag(dependency, this);
  }).seq(function () {
    task.task(this);
  }).finally(cb);
};

Yantr.prototype.__execByTag = function (tag, cb) {
  var self = this;
  Yaff(this.index[tag] || []).parEach(function (task) {
    self.__taskExecutor(task, this);
  }).finally(cb);
};
