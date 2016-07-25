const cache = require('../../lib/cache');
const path = require('path');
const fs = require('fs');

exports = module.exports = function() {

	var me = this;

	this.log.writeln('');
	this.log.subhead('Start removePackage..');
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

	if (typeof argv['i'] === 'string') {
		identityName = argv['i'];
		this.log.writeln('identityName: ', identityName);
	} else {
		throw new Error('missing package identityName.');
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
				var index = 0;
				var defaultDojoConfig = cache.query('dojoConfig');
				var sourcePackages = defaultDojoConfig.packages;
				_dojoConfig = cache.query('localDojoConfig');
				if (!_dojoConfig) {
					eval(fs.readFileSync(dojoConfigPath, 'utf-8'));
					_dojoConfig = dojoConfig;
				}
				packages = _dojoConfig.packages;

				var indexInPackages = packages.findIndex((_package) => {
	        return _package.name === name;
	      });
	      var sourcePackage = sourcePackages.filter((_package) => {
	        return _package.name === name;
	      });
	      if (indexInPackages > -1 && sourcePackage.length) {
	        packages[indexInPackages].location = sourcePackage[0].location;
	      }

	      if (indexInPackages > -1 && !sourcePackage.length) {
	        packages.splice(indexInPackages, 1);
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
	 *	packagesscript.js
	 */
	this.log.subhead('update packagesscript..');
	var packagesScriptPath = path.join(cwd, 'packagesscript.js');
	var _packagesScript = [];
	(function() {
		if (fs.existsSync(packagesScriptPath)) {
			try {
				var packages = [];
				var result = [];
				var sourcePackages = cache.query('packagesScript');
				_packagesScript = cache.query('localPackagesScript');
				if (!_packagesScript) {
					eval(fs.readFileSync(packagesScriptPath, 'utf-8'));
					_packagesScript = ismppacages;
				}
	      var indexInPackages = _packagesScript.findIndex((_package) => {
	        return _package.identityName === identityName;
	      });
	      var sourcePackage = sourcePackages.filter((_package) => {
	        return _package.identityName === identityName;
	      });
	      if (indexInPackages > -1 && sourcePackage.length) {
	        _packagesScript[indexInPackages].modulePath = sourcePackage[0].modulePath;
	      }

	      if (indexInPackages > -1 && !sourcePackage.length) {
	        _packagesScript.splice(indexInPackages, 1);
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
}