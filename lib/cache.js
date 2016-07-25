const grunt = require('grunt');
const fs = require('fs');
const path = require('path');

const log = console.log.bind(console);

const cacheFile = path.join(__dirname, './cache.json');

function _update(key, data) {
	var cache = {};
	try {
		cache = grunt.file.readJSON(cacheFile);
	} catch (e) {}

	cache[key] = data;

	try {
		fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
	} catch (e) {
		return false;
	}
	return true;
}

function _delete(key) {
	var cache = {};
	try {
		cache = grunt.file.readJSON(cacheFile);
	} catch (e) {}

	try {
		delete cache[key];
		fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
	} catch (e) {
		return false;
	}
	return true;
}

function _query(key) {
	var cache = {};
	try {
		cache = grunt.file.readJSON(cacheFile);
	} catch (e) {
		return false;
	}
	return cache[key];
}

exports = module.exports = {
	update: _update,
	del: _delete,
	query: _query
};