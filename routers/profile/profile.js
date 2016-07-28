const fs = require('fs');
const madge = require('madge');
const path = require('path');

exports = module.exports = function() {

	var me = this;

	this.log.writeln('');
	this.log.subhead('Generate profile.js Start.');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;
	var docRoot = argv['n'];
	var excludeReg = argv['e'];

	/*
	 *	检查参数
	 */
	if (typeof docRoot !== 'string') {
		return this.log.error('wrong arguments.');
	}

	this.log.writeln('name: ', docRoot);

	if (typeof excludeReg === 'string'){
		this.log.writeln('exclude: ', excludeReg);
	}else{
		excludeReg = '';
	}

	/*
	 *	load config
	 */
	this.log.subhead('build profile.js.');
	this.log.writeln('check: profile.js exists.');
	if (!fs.existsSync(path.join(cwd, 'profile.js'))) {
		this.log.writeln('       generate profile.js start.');
		var config = this.file.readJSON(path.join(__dirname, './config.json'))
		var defaultOption = config.defaultProfile;
		var defaultPackage = config.defaultPackage;

		/*
		 *  find dep
		 */
		var dependency = madge(['./', docRoot].join(''), {
			format: 'amd',
			findNestedDependencies: true
		});

		/*
		 *	build profile object
		 */
		var layerName = [docRoot, docRoot].join('/');
		var depTree = dependency.tree;
		var layerInclude = Object.keys(depTree).filter((filePath) => {
			return depTree[filePath].length;
		}).map(function(depTree) {
			return path.join(docRoot, depTree);
		});
		var layerExclude = [];
		var layerExcludeMap = {};

		var regStr = excludeReg.split(',').filter((name) => {
			return name !== docRoot;
		}).join('|');
		var reg = new RegExp(['(^', regStr, ')'].join(''));

		Object.keys(depTree).forEach((filePath) => {
			var deps = depTree[filePath];
			deps.forEach((depPath) => {
				if (excludeReg && reg.test(depPath) && !layerExcludeMap[depPath]) {
					layerExcludeMap[depPath] = true;
					layerExclude.push(depPath);
				}
			});
		});
		defaultOption.layers[layerName] = {
			include: layerInclude,
			exclude: layerExclude
		};
		defaultOption.packages.push({
			name: docRoot,
			location: docRoot
		}, {
			name: 'dojo',
			location: 'node_modules/dojo'
		}, {
			name: 'dijit',
			location: 'node_modules/dijit'
		}, {
			name: 'dojox',
			location: 'node_modules/dojox'
		});

		/*
		 *  write profile
		 */
		var str2write = ['var', 'profile', '=', JSON.stringify(defaultOption, null, 2)].join(' ');
		try {
			fs.writeFileSync('./profile.js', str2write);
			me.log.writeln('       generate profile.js done.');
		} catch (err) {
			this.log.writeln('       generate profile.js error');
			me.log.error(err);
			return false;
		}
	}else{
		this.log.writeln('profile.js exists.');
	}

	/*
	 *	write package.json
	 */
	this.log.subhead('build package.json.');
	this.log.writeln('check: package.json exists.');
	var packageJsonPath = path.join(cwd, docRoot, 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		this.log.writeln('       generate package.json start');
		var sourcePackage = defaultPackage;
		sourcePackage.dojoBuild = docRoot.concat('.profile.js');
		fs.writeFileSync(packageJsonPath, JSON.stringify(sourcePackage, null, 2));
		this.log.writeln('       generate package.json done.');
	}else{
		this.log.writeln('package.json exists.');
	}

	/*
	 *	write <% docRoot %>.profile.js
	 */
	var innerProfile = docRoot.concat('.profile.js');
	this.log.subhead(['build', innerProfile].join(' '));
	this.log.writeln(['check:', innerProfile, 'exists.'].join(' '));
	var profilePath = path.join(cwd, docRoot, docRoot.concat('.profile.js'));
	var sourceProfilePath = path.join(__dirname, 'default.profile.js');
	if (!fs.existsSync(profilePath)) {
		this.log.writeln(['       generate', innerProfile, 'start'].join(' '));
		try {
			fs.writeFileSync(profilePath, fs.readFileSync(sourceProfilePath));
			this.log.writeln(['       generate', innerProfile, 'done'].join(' '));
		} catch (e) {
			this.log.writeln(['       generate', innerProfile, 'error'].join(' '));
			me.log.error(e.stack);
		}
	}else{
		this.log.writeln([innerProfile, 'exists.'].join(' '));
	}

	me.log.ok();
};