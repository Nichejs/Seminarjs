/**
 * Tests bootstrap utility, it sets up Seminarjs to work as an
 * actual standalone program.
 */
var seminarjs = require('../index.js');

seminarjs.init({

	'name': 'Seminarjs Demo',

	'favicon': 'public/favicon.ico',
	'static': ['public'],

	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'mongo': 'mongodb://localhost/my-project',

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'blablabla'

});

seminarjs.start();