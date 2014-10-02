/**
 * Seminarjs Plugin loader
 *
 * @api public
 */

function loadPlugin(plugin) {
	console.log("[Load plugin] " + plugin);

	// Plugins
	var plugin = require("seminarjs-" + plugin);
	plugin(this);
}

module.exports = loadPlugin;