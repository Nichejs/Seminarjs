var path = require('extend');

/**
 * User handling for Seminarjs, this should hold the logged in users
 * at any moment, and should be shared by the contest, the chat... etc
 *
 */
function users() {

	var seminarjs = this;

	var exports = {};

	exports.list = [];

	/**
	 * Add a user
	 * @param {string} name       User name
	 * @param {Object} attributes List of attributes to be added to the user
	 */
	exports.add = function (name, attributes) {
		if (exports.find(name)) {
			return false;
		} else {
			exports.list.push(new User(name, attributes));
		}
	};

	/**
	 * Finds users
	 * @param  {string} name User name
	 * @return {int}	Integer >-1 if the user is found, or -1 if not.
	 */
	exports.find = function (name) {
		var total = exports.list.length;

		for (var i = 0; i < total; i++) {
			if (exports.list[i].name == name) {
				return i;
			}
		}

		return -1;
	};

	/**
	 * Removes a user from the list
	 * @param  {string} name User name
	 */
	exports.remove = function (name) {
		var index = exports.find(name);

		exports.list.splice(index, 1);
	};

	/**
	 * Set a property for a user
	 * @param {string} name  Username
	 * @param {String} param Parameter name
	 * @param {String} value Parameter value
	 */
	exports.set = function (name, param, value) {
		var index = exports.find(name);

		exports.list[index][param] = value;
	};

	/**
	 * Get a parameter
	 * @param  {string} name  User name
	 * @param  {String} param Parameter name
	 * @return {String}       Parameter value
	 */
	exports.get = function (name, param) {
		var index = exports.find(name);

		return exports.list[index][param];
	};

	/**
	 * User constructor
	 * @param {string} name       User name
	 * @param {object} attributes User properties
	 */
	function User(name, attributes) {
		var ret = {
			name: user
		};

		return extend(ret, attributes);
	}

	return exports;
}

module.exports = users;