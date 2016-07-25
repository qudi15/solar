const path = require('path');
const fs = require('fs');

exports = module.exports = function() {
	var me = this;

	this.log.writeln('');
	this.log.subhead('Start publish package.');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;
	var name = argv['n'];

	/*
	 *	检查参数
	 */
	if (typeof name !== 'string') {
		return this.log.error('missing arguments.');
	}
	this.log.writeln('name: ', name);

	/*
	 *	检查环境
	 */
	var projectPackagePath = path.join(cwd, 'package.json');
	var libPackagePath = path.join(cwd, 'lib', name, 'package.json');

	if (!fs.existsSync(projectPackagePath)) {
		return this.log.error('missing package.json');
	}

	this.log.subhead('merge package params.');

	var projectPackage = this.file.readJSON(projectPackagePath);
	var mergePackage = fs.existsSync(libPackagePath) ? this.file.readJSON(libPackagePath) : projectPackage;
	for (var key in projectPackage) {
		mergePackage[key] = projectPackage[key];
	}
	try {
		fs.writeFileSync(libPackagePath, JSON.stringify(mergePackage, null, 2));
		me.log.writeln('merge done');
	} catch (e) {
		me.log.writeln('merge error');
	}

	var child = {
		cmd: 'npm',
		args: ['publish'],
		opts: {
			cwd: path.join(cwd, 'lib', name),
			stdio: 'inherit'
		}
	};

	this.util.spawn(child, function(err) {
		me.log.ok();
	});
};