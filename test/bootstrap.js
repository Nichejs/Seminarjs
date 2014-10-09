/**
 * Tests bootstrap utility, it sets up Seminarjs to work as an
 * actual standalone program.
 */
var seminarjs = require('../index.js');

seminarjs.init({

	'name': 'Seminarjs Demo',

	'favicon': 'public/favicon.ico',
	'static': ['../app/public'],

	'views': '../app/views',
	'view engine': 'ejs',

	'auto update': true,
	'mongo': 'mongodb://nichejs:CursoIEEE2014@ds063909.mongolab.com:63909/curso2014',

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'blablabla'

});

seminarjs.start();