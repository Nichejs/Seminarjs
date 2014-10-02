var path = require('path'),
	express = require('express');

/**
 * Adds bindings for seminarjs static resources
 * Can be included before other middleware (e.g. session management, logging, etc) for
 * reduced overhead
 *
 * @param {Express()} app
 * @api public
 */

function static(app) {

	console.log("[Start] Static server on " + __dirname + '../../../../public');

	app.use(express.static(__dirname + '../../../../public'))

	return this;

}

module.exports = static;