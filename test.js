var log = console.log();

var Yantr = require('./index.js');

var tasks = [
];

Yantr(tasks).run(function () {
  log('Done!');
});
