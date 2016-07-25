#!/usr/local/bin/node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

var core = require('../');

var cli = new Liftoff({
  name: 'solar',
  processTitle: 'solar',
  moduleName: 'solar',
  extensions: {
    '.js': null
  }
});

cli.launch({
  cwd: argv.r || argv.root
}, function(env) {
	var app = new core;
	app.run(argv, env);
});