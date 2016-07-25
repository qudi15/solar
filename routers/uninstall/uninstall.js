exports = module.exports = function() {

	var me = this;

	this.log.writeln('');
	this.log.subhead('Uninstall Start..');
	this.log.writeln('');

	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;

	/*
	 *	检查有效
	 */
	var packages;
	var saveFlag = false;

	if (typeof argv['n'] === 'string' || Array.isArray(argv['n'])) {
		packages = argv['n'];
		this.log.writeln('packages: ', packages);
	} else {
		throw new Error('missing package name..');
	}

	if (typeof argv['save'] === 'boolean') {
		saveFlag = argv['save'];
	}
	this.log.writeln('save: ', saveFlag);
	this.log.subhead('start unload packages..');

	var _args = [].concat(packages);

	if(saveFlag){ _args.push('--save'); }

	var child = {
		cmd: 'npm',
		args: ['uninstall'].concat(_args),
		opts: {
			cwd: cwd,
			stdio: 'inherit'
		}
	};

	this.util.spawn(child, function(err) {
		if(err){throw err;}
		me.log.ok();
	});
};