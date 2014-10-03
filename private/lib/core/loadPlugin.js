/**
 * Seminarjs Plugin loader
 *
 * @api public
 */

function loadPlugin(plugin) {
	console.log("[Load plugin] " + plugin);

	var seminarjs = this;

	// Load the plugin
	var plugin = require("seminarjs-" + plugin);
	plugin(seminarjs);
}

module.exports = loadPlugin;