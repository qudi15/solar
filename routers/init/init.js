const fs = require('fs');
const path = require('path');

exports = module.exports = function() {
	var argv = this.argv;
	var env = this.env;
	var cwd = env.cwd;

	var name = desc  = '';
	var version = '0.0.1';

	this.log.writeln('');
	this.log.subhead('Init Start..');
	this.log.writeln('');

	/*
	 *	检查有效
	 */
	if(typeof argv['n'] === 'string'){
		name = argv['n'];
		this.log.writeln('name: ', name);
	}else{
		throw new Error('missing package name..');
	}

	if(typeof argv['d'] === 'string'){
		desc = argv['d'];
		this.log.writeln('description: ', desc);
	}else{
		throw new Error('missing package description..');
	}

	if(typeof argv['v'] === 'string'){
		version = argv['v'];
	}
	this.log.writeln('version: ', version);
	this.log.writeln('');

	this.log.subhead('start merge arguments..');
	/*
	 *	赋值
	 */
	var sourcePackagePath = path.join(__dirname, 'package.json');
	var sourcePackage = this.file.readJSON(sourcePackagePath);
	var projectPackagePath = path.join(cwd, 'package.json');
	sourcePackage.name = name;
	sourcePackage.description = desc;
	sourcePackage.version = version;

	this.log.writeln('merge done.');

	/*
	 *	写文件
	 */
	this.log.subhead('start write file..');
	fs.writeFileSync(projectPackagePath, JSON.stringify(sourcePackage, null, 2));
	this.log.writeln('write done.');

	this.log.writeln('');
	this.log.ok();
};