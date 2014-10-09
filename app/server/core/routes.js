/**
 * Adds bindings for the seminarjs routes
 *
 * ####Example:
 *
 *     var app = express();
 *     app.configure(...); // configuration settings
 *     app.use(...); // middleware, routes, etc. should come before seminarjs is initialised
 *     seminarjs.routes(app);
 *
 * @param {Express()} app
 * @api public
 */

function routes(app) {

	this.app = app;
	var seminarjs = this;

	app.get('/version', function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({
			'name': seminarjs.get('name'),
			'seminarjsVersion': seminarjs.version
		}));
	});

	app.get('/', function (req, res) {
		res.render('home.ejs'); // load the index.ejs file
	});

	return this;

}

module.exports = routes;