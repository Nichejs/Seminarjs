var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	app = express(),
	_ = require('underscore');


/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function (_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); //get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Seminarjs Class
 *
 * @api public
 */
var Seminarjs = function () {

	this._options = {
		'name': 'Seminarjs',
		'brand': 'Seminarjs',
		'compress': true,
		'headless': false,
		'logger': 'dev',
		'auto update': false,
		'model prefix': null
	};

	this.express = app;
	this.io = null;

	this.set('moduleRoot', moduleRoot);

	this.set('env', process.env.NODE_ENV || 'development');

	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP);
	this.set('listen', process.env.LISTEN);

	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT);
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);

	this.set('cookie secret', process.env.COOKIE_SECRET);

	this.version = require('./package.json').version;

};

_.extend(Seminarjs.prototype, require('./app/server/core/options')(moduleRoot));

/* Attach core functionality to Seminarjs.prototype */
Seminarjs.prototype.init = require('./app/server/core/init');
Seminarjs.prototype.connect = require('./app/server/core/connect');
Seminarjs.prototype.start = require('./app/server/core/start');
Seminarjs.prototype.mount = require('./app/server/core/mount');
Seminarjs.prototype.routes = require('./app/server/core/routes');
Seminarjs.prototype.static = require('./app/server/core/static');
Seminarjs.prototype.wrapHTMLError = require('./app/server/core/wrapHTMLError');
Seminarjs.prototype.loadPlugin = require('./app/server/core/loadPlugin');

/**
 * The exports object is an instance of Seminarjs.
 *
 * @api public
 */
var seminarjs = module.exports = exports = new Seminarjs();