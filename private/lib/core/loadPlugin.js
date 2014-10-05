/**
 * Seminarjs Plugin loader
 *
 * @api public
 */

var prequire = require('parent-require');

function loadPlugin(plugin) {
	console.log("[Load plugin] " + plugin);

	var seminarjs = this;

	// Load the plugin
	var plugin = prequire("seminarjs-" + plugin);
	plugin(seminarjs);
}

module.exports = loadPlugin;