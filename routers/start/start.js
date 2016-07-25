const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');

const cache = require('../../lib/cache');

function _evalString(argument) {

}

exports = module.exports = function() {

	var me = this;

	this.log.writeln('');
	this.log.subhead('Init local environment Start..');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;

	var localFlag = false;

	if(typeof argv['local'] === 'boolean'){
		localFlag = argv['local'];
	}

	/*
	 *	拷贝./static/* 到 <cwd>/
	 */

	this.log.subhead('start copy static files to your folder..');
	var staticFolder = path.join(__dirname, './static');
	try {
		fse.copySync(staticFolder, cwd);
	} catch (err) {
		return false;
	}

	/*
	 *	读取dojoConfig.js
	 */
	
	this.log.subhead('loading dojoConfig..');
	var dojoConfigPath = path.join(cwd, 'dojoConfig.js');
	var _dojoConfig = {};
	(function() {
		if (fs.existsSync(dojoConfigPath)) {
			try {
				eval(fs.readFileSync(dojoConfigPath, 'utf-8'));
				_dojoConfig = dojoConfig;
			} catch (e) {
				console.log(e.stack);
			}
		}
	})();

	/*
	 *	读取packages.js
	 */
	
	this.log.subhead('loading packagesScript..');
	var packagesScriptPath = path.join(cwd, 'packagesscript.js');
	var _packagesScript = [];
	(function() {
		if (fs.existsSync(packagesScriptPath)) {
			try {
				var dojoConfig = {
					packages: []
				};
				eval(fs.readFileSync(packagesScriptPath, 'utf-8'));
				_packagesScript = ismppacages;
			} catch (e) {
				console.log(e.stack);
			}
		}
	})();

	/*
	 *	更新缓存
	 */
	
	this.log.subhead('init cache..');
	cache.update('localDojoConfig', _dojoConfig);
	cache.update('localPackagesScript', _packagesScript);
	cache.update('dojoConfig', _dojoConfig);
	cache.update('packagesScript', _packagesScript);

	this.log.ok();
};