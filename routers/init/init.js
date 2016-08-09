const fs = require('fs');
const path = require('path');

var download = require('download-git-repo');
var exists = fs.existsSync;
var rm = require('rimraf').sync;
var uid = require('uid');
var ora = require('ora');
var chalk = require('chalk');
var inquirer = require('inquirer');
var request = require('request');
var logger = require('../../lib/logger');
var generate = require('../../lib/generate');
var checkVersion = require('../../lib/check-version');

const template = 'IBM-DST/dev-template';

exports = module.exports = function() {
	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;

	var name = desc = '';
	var version = '0.0.1';

	var to = path.resolve('.');

	this.log.writeln('');
	this.log.subhead('Init Start..');
	this.log.writeln('');

	var me = this;

	function installPackages(cb) {
		var child = {
			cmd: 'npm',
			args: ['install'],
			opts: {
				cwd: cwd,
				stdio: 'inherit'
			}
		};

		this.log.writeln('Start to install packages.');
		me.util.spawn(child, function(err) {
			if (err) {
				throw err;
			}
			cb && cb();
		});
	}

	function downloadAndGenerate(template) {
		var tmp = '/tmp/dst-template-' + uid()
		var spinner = ora('downloading template')
		spinner.start()
		download(template, tmp, {
			clone: false
		}, function(err) {
			spinner.stop()
			process.on('exit', function() {
				rm(tmp)
			})
			if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
			generate(name, tmp, to, function(err) {
				if (err) logger.fatal(err)
				console.log()
				installPackages(function () {
					logger.success('Generated Done');
				});
			})
		})
	}

	function checkDistBranch(template, cb) {
		request({
			url: 'https://api.github.com/repos/' + template + '/branches',
			headers: {
				'User-Agent': 'solar-cli'
			}
		}, function(err, res, body) {
			if (err) logger.fatal(err)
			if (res.statusCode !== 200) {
				logger.fatal('Template does not exist: ' + template)
			} else {
				var hasDist = JSON.parse(body).some(function(branch) {
					return branch.name === 'dist'
				})
				return cb(hasDist ? template + '#dist' : template)
			}
		})
	}

	checkDistBranch(template, downloadAndGenerate);
};