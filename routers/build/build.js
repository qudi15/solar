const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

exports = module.exports = function() {
	var me = this;

	this.log.writeln('');
	this.log.subhead('Start dojo build.');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;
	var name = argv['n'];

	/*
	 *	检查参数
	 */
	if (typeof name !== 'string') {
		this.log.writeln('name: ', name);
		return this.log.error('wrong arguments.');
	}

	/*
	 *	检查环境
	 */
	var profilePath = path.join(cwd, 'profile.js');
	var projectPackagePath = path.join(cwd, 'package.json');
	var libPackagePath = path.join(cwd, name, 'package.json');
	var innerProfilePath = path.join(cwd, name, name.concat('.profile.js'));
	this.log.subhead('check environment.');
	if (!fs.existsSync(projectPackagePath)) {
		return this.log.error('Pls init your project first.');
	}

	if (!fs.existsSync(profilePath)) {
		return this.log.error('Pls generate profile first.');
	}

	if (!fs.existsSync(libPackagePath)) {
		return this.log.error('Pls generate package.json first.');
	}

	if (!fs.existsSync(innerProfilePath)) {
		return this.log.error('Pls generate <name>.profile.js first.');
	}

	this.log.writeln('check environment done.');

	/*
	 *	加载profile
	 */
	this.log.subhead('load profile.');
	var _profile = {
		packages: []
	};
	(function() {
		try {
			eval(fs.readFileSync(profilePath, 'utf-8'));
			if (typeof profile !== 'undefined') {
				_profile = profile
			}
		} catch (e) {
			console.log(e);
		}
	})();

	var _argv = [];
	var packages = _profile.packages;
	packages.forEach((_package) => {
		var _packageName = _package.name;
		if (/^node_modules/.test(_package.location)) {
			_argv.push(_packageName);
		}
	});
	_argv.push('dojo-util');

	var child = {
		cmd: 'npm',
		args: ['install'].concat(_argv),
		opts: {
			cwd: cwd,
			stdio: 'inherit'
		}
	};

	var installPackagesProcess = new Promise((resolve, reject) => {
		me.util.spawn(child, function(err) {
			if (err) {
				return reject(err);
			}
			resolve('done');
		});
	});

	installPackagesProcess.then(() => {
		var oldPath = path.join(cwd, 'node_modules/dojo-util');
		var newPath = path.join(cwd, 'node_modules/util');
		try {
			if (fs.existsSync(oldPath)) {
				fse.copySync(oldPath, newPath);
			}
		} catch (e) {
			console.log(e);
			return false;
		}

		var child = {
			cmd: 'node',
			args: [
				path.join(cwd, './node_modules/dojo/dojo.js'), 'load=build',
				'profile=' + profilePath,
			],
			opts: {
				stdio: 'inherit'
			}
		};
		me.util.spawn(child, function(err) {
			me.log.ok();
		});
	});
};