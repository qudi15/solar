const cache = require('../../lib/cache');
const path = require('path');
const fs = require('fs');

exports = module.exports = function() {

	var me = this;

	this.log.writeln('');
	this.log.subhead('Start addPackage..');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;

	/*
	 *	检查有效
	 */
	var name = location = identityName = modulePath = '';
	if (typeof argv['n'] === 'string') {
		name = argv['n'];
		this.log.writeln('name: ', name);
	} else {
		throw new Error('missing package name.');
	}

	if (typeof argv['l'] === 'string') {
		location = argv['l'];
		this.log.writeln('location: ', location);
	} else {
		throw new Error('missing package location.');
	}

	if (typeof argv['i'] === 'string') {
		identityName = argv['i'];
		this.log.writeln('identityName: ', identityName);
	} else {
		throw new Error('missing package identityName.');
	}

	if (typeof argv['p'] === 'string') {
		modulePath = argv['p'];
		this.log.writeln('modulePath: ', modulePath);
	} else {
		throw new Error('missing package modulePath.');
	}
	this.log.writeln('');

	/*
	 *	更新dojoConfig.js
	 */
	this.log.subhead('update dojoConfig..');
	var dojoConfigPath = path.join(cwd, 'dojoConfig.js');
	var _dojoConfig = {};
	(function() {
		if (fs.existsSync(dojoConfigPath)) {
			try {
				var packages = [];
				var result = [];
				_dojoConfig = cache.query('localDojoConfig');
				if(!_dojoConfig){
					eval(fs.readFileSync(dojoConfigPath, 'utf-8'));
					_dojoConfig = dojoConfig;
				}
				packages = _dojoConfig.packages;
				result = packages.filter((_package) => {
					return _package.name === name;
				});
				if (result.length) {
					result[0].location = location;
				} else {
					packages.push({
						name: name,
						location: location
					});
				}
				fs.writeFileSync(dojoConfigPath, [
					'var', 'dojoConfig', '=', JSON.stringify(_dojoConfig, null, 2)
				].join(' '));
				cache.update('localDojoConfig', _dojoConfig);
				me.log.writeln('update dojoConfig done.');
			} catch (e) {
				me.log.writeln('update dojoConfig error.', e.stack);
			}
		}
	})();

	/*
	 *	更新dojoConfig.js
	 */
	this.log.subhead('update packagesscript..');
	var packagesScriptPath = path.join(cwd, 'packagesscript.js');
	var _packagesScript = [];
	(function() {
		if (fs.existsSync(packagesScriptPath)) {
			try {
				var packages = [];
				var result = [];
				_packagesScript = cache.query('localPackagesScript');
				if(!_packagesScript){
					eval(fs.readFileSync(packagesScriptPath, 'utf-8'));
					_packagesScript = ismppacages;
				}
				result = _packagesScript.filter((_package) => {
					return _package.identityName === identityName;
				});
				if (result.length) {
					result[0].modulePath = modulePath;
					result[0].isPackaged = false;
				} else {
					_packagesScript.push({
						identityName: identityName,
						isPackaged: false,
						modulePath: modulePath
					});
				}
				fs.writeFileSync(packagesScriptPath, [
					'var', 'ismppacages', '=', JSON.stringify(_packagesScript, null, 2),
					fs.readFileSync(path.join(__dirname, 'static.js'), 'utf-8')
				].join(' '));
				cache.update('localPackagesScript', _packagesScript);
				me.log.writeln('update packagesscript done.');
			} catch (e) {
				me.log.writeln('update packagesscript error.', e.stack);
			}
		}
	})();

	this.log.ok();
};