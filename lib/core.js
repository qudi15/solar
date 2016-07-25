

const grunt = require('grunt');
const path = require('path');
const fs = require('fs');

var app = exports = module.exports = function () {this.init.apply(this, arguments)};

var _ = app.prototype._ = require('lodash');

_.assign(app.prototype, require('events').EventEmitter.prototype, grunt);

/*
 *	初始化
 */
app.prototype.init = function() {
	this.argv = {};
	this.env = {};
	this._loadRouters();
};

/*
 * 按照 configs/router.json 加载模块
 */
app.prototype._loadRouters = function() {
	var me = this;
	var confgPath = path.join(__dirname, '../configs/router.json');
	var config = this.file.readJSON(confgPath);
	Object.keys(config).forEach((command) => {
		var modulePath = path.join(__dirname, '../routers', config[command]);
		if(fs.existsSync(modulePath)){
			var module = require(modulePath);
			me.use(command, module);
		}
	});
};

/*
 *	注册模块
 */
app.prototype.use = function(command, handle) {
	this.on(command, handle.bind(this));
};

/*
 * 启动
 */
app.prototype.run = function(argv, env) {
	this._.assign(this.argv, argv);
	this._.assign(this.env, env);
	var command = argv._[0];
	this.emit(command);
};