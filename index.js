var Yaff  = require('yaff');
var maybe = require('maybe2');

var Yantr = module.exports = function Yantr(tasks) {
  if (!(this instanceof Yantr))
    return new Yantr(tasks);
  this.tasks = maybe(tasks).is(Array).getOrElse([]);
  this.index = tasks.reduce(function (index, task) {
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
  if (__isCyclic(this.tasks.map(function (task) {
    return {tags: task.tags, depends: task.depends};
  })))
    return cb(new Error('Provided graph contains circular dependencies'));
  Yaff(this.tasks).parEach(function (task) {
    __taskExecutor(task, self.index, this);
  }).finally(cb);
};

var __isCyclic = function (tasks) {
  if (!tasks.length)
    return false;
  var free_tasks = tasks.filter(function (task) {
    return !(task.depends || []).length;
  });
  if (!free_tasks.length)
    return true;
  var new_tasks = tasks.filter(function (task) {
    return !!(task.depends || []).length;
  });
  var tags_to_remove = free_tasks.reduce(function (ret, task) {
    return ret.concat(task.tags);
  }, []).reduce(function (ret, tag) {
    if (ret.indexOf(tag) == -1)
      ret.push(tag);
    return ret;
  }, []).filter(function (tag) {
    return !new_tasks.some(function (task) {
      return task.tags.indexOf(tag) != -1;
    });
  });
  return __isCyclic(new_tasks.map(function (task) {
    task.depends = task.depends.filter(function (dep) {
      return !tags_to_remove.some(function (tag) {
        return tag == dep;
      });
    });
    return task;
  }));
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
  }).seq(function () {
    task.done = true;
    this();
  }).finally(cb);
};
