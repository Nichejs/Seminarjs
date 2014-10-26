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

	app.use('/admin', function (req, res) {
		res.render('../../views/' + req.path + '.ejs'); // load the index.ejs file
	});

	return this;

}

module.exports = routes;