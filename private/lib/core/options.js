var path = require('path'),
	_ = require('underscore'),
	utils = require('keystone-utils');

function options(moduleRoot) {

	var exports = {};

	/**
	 * This file contains methods specific to dealing with Seminarjs's options.
	 * All exports are added to the Seminarjs.prototype
	 */

	// Deprecated options that have been mapped to new keys
	var remappedOptions = {

	};

	/**
	 * Sets seminarjs options
	 *
	 * ####Example:
	 *
	 *     seminarjs.set('user model', 'User') // sets the 'user model' option to `User`
	 *
	 * @param {String} key
	 * @param {String} value
	 * @api public
	 */
	exports.set = function (key, value) {

		if (arguments.length === 1) {
			return this._options[key];
		}

		if (remappedOptions[key]) {
			key = remappedOptions[key];
		}

		// handle special settings
		switch (key) {
		case 'auth':
			if (value === true && !this.get('session')) {
				this.set('session', true);
			}
			break;
		case 'nav':
			this.nav = this.initNav(value);
			break;
		}

		this._options[key] = value;
		return this;
	};


	/**
	 * Sets multiple seminarjs options.
	 *
	 * ####Example:
	 *
	 *     seminarjs.set({test: value}) // sets the 'test' option to `value`
	 *
	 * @param {Object} options
	 * @api public
	 */

	exports.options = function (options) {
		if (!arguments.length)
			return this._options;
		if (utils.isObject(options)) {
			var keys = Object.keys(options),
				i = keys.length,
				k;
			while (i--) {
				k = keys[i];
				this.set(k, options[k]);
			}
		}
		return this._options;
	};


	/**
	 * Gets seminarjs options
	 *
	 * ####Example:
	 *
	 *     seminarjs.get('test') // returns the 'test' value
	 *
	 * @param {String} key
	 * @api public
	 */

	exports.get = exports.set;

	/**
	 * Gets an expanded path option, expanded to include moduleRoot if it is relative
	 *
	 * ####Example:
	 *
	 *     seminarjs.get('pathOption', 'defaultValue')
	 *
	 * @param {String} key
	 * @param {String} defaultValue
	 * @api public
	 */

	exports.getPath = function (key, defaultValue) {
		return this.expandPath(this.get(key) || defaultValue);
	};

	/**
	 * Expands a path to include moduleRoot if it is relative
	 *
	 * @param {String} pathValue
	 * @api public
	 */

	exports.expandPath = function (pathValue) {
		pathValue = ('string' === typeof pathValue && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\') ? path.join(moduleRoot, pathValue) : pathValue;
		return pathValue;
	};

	return exports;

}

module.exports = options;