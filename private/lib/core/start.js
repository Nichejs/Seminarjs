/**
 * Configures and starts a Seminarjs app in encapsulated mode.
 *
 * Connects to the database, runs updates and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *   - onStart
 *   - onHttpServerCreated
 *   - onHttpsServerCreated
 *
 * If the events argument is a function, it is assumed to be the started event.
 *
 *
 * ####Options:
 *
 * Seminarjs supports the following options specifically for running in encapsulated mode:
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *   - ssl
 *   - sslport
 *   - sslkey
 *   - sslcert
 *
 *
 * @api public
 */

var fs = require('fs'),
	http = require('http'),
	https = require('https');

var dashes = '\n------------------------------------------------\n';

function start(events) {

	// Validate arguments

	if ('function' === typeof events) {
		events = {
			onStart: events
		};
	}

	if (!events) events = {};

	// Ensure Seminarjs has been initialised

	if (!this.app) {
		throw new Error('Seminarjs Initialisaton Error:\n\napp must be initialised. Call seminarjs.init() or seminarjs.connect(new Express()) first.\n\n');
	}

	// Localise references to this for closures

	var seminarjs = this,
		app = this.app;

	// Maintain passed in onMount binding but override to start http servers
	// (call user-defined onMount first if present)

	var onMount = events.onMount;

	events.onMount = function () {

		onMount && onMount();

		var startupMessages = ['Seminarjs Started:'],
			waitForServers = 2;

		// Log the startup messages and calls the onStart method

		var serverStarted = function () {
			waitForServers--;
			if (waitForServers) return;
			if (seminarjs.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			events.onStart && events.onStart();
		};

		// Create the http server and listens to the specified port and host or listen option.
		//
		// For more information on how these options work, see
		// http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
		// and for history, see https://github.com/JedWatson/seminarjs/issues/154

		seminarjs.httpServer = http.createServer(app);
		events.onHttpServerCreated && events.onHttpServerCreated();

		seminarjs.io = require('socket.io')(seminarjs.httpServer);

		var host = seminarjs.get('host'),
			port = seminarjs.get('port'),
			listen = seminarjs.get('listen'),
			ssl = seminarjs.get('ssl');

		// start the http server unless we're in ssl-only mode

		if (ssl !== 'only') {

			var httpStarted = function (msg) {
				return function () {
					startupMessages.push(msg);
					serverStarted();
				};
			};

			if (port || port === 0) {

				app.set('port', port);

				var httpReadyMsg = seminarjs.get('name') + ' is ready';

				if (host) {
					httpReadyMsg += ' on http://' + host;
					if (port) {
						httpReadyMsg += ':' + port;
					}
					// start listening on the specified host and port
					seminarjs.httpServer.listen(port, host, httpStarted(httpReadyMsg));
				} else {
					if (port) {
						httpReadyMsg += ' on port ' + port;
					}
					// start listening on any IPv4 address (INADDR_ANY) and the specified port
					seminarjs.httpServer.listen(port, httpStarted(httpReadyMsg));
				}

			} else if (host) {
				// start listening on a specific host address and default port 3000
				app.set('port', 3000);
				seminarjs.httpServer.listen(3000, host, httpStarted(seminarjs.get('name') + ' is ready on ' + host + ':3000'));
			} else if (listen) {
				// start listening to a unix socket
				seminarjs.httpServer.listen(listen, httpStarted(seminarjs.get('name') + ' is ready' + (('string' === typeof listen) ? ' on ' + listen : '')));
			} else {
				// default: start listening on any IPv4 address (INADDR_ANY) and default port 3000
				app.set('port', 3000);
				seminarjs.httpServer.listen(3000, httpStarted(seminarjs.get('name') + ' is ready on default port 3000'));
			}

		} else {
			waitForServers--;
		}

		// start the ssl server if configured

		if (ssl) {

			var sslOpts = {};

			if (seminarjs.get('ssl cert') && fs.existsSync(seminarjs.getPath('ssl cert'))) {
				sslOpts.cert = fs.readFileSync(seminarjs.getPath('ssl cert'));
			}
			if (seminarjs.get('ssl key') && fs.existsSync(seminarjs.getPath('ssl key'))) {
				sslOpts.key = fs.readFileSync(seminarjs.getPath('ssl key'));
			}

			if (!sslOpts.key || !sslOpts.cert) {

				if (ssl === 'only') {
					console.log(seminarjs.get('name') + ' failed to start: invalid ssl configuration');
					process.exit();
				} else {
					startupMessages.push('Warning: Invalid SSL Configuration');
					serverStarted();
				}

			} else {

				var httpsStarted = function (msg) {
					return function () {
						startupMessages.push(msg);
						serverStarted();
					};
				};

				seminarjs.httpsServer = https.createServer(sslOpts, app);
				events.onHttpsServerCreated && events.onHttpsServerCreated();

				var sslHost = seminarjs.get('ssl host') || host,
					sslPort = seminarjs.get('ssl port') || 3001;

				var httpsReadyMsg = (ssl === 'only') ? seminarjs.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';

				if (sslHost) {
					seminarjs.httpsServer.listen(sslPort, sslHost, httpsStarted(httpsReadyMsg + 'https://' + sslHost + ':' + sslPort));
				} else {
					var httpsPortMsg = (seminarjs.get('ssl port')) ? 'port: ' + seminarjs.get('ssl port') : 'default port 3001';
					seminarjs.httpsServer.listen(sslPort, httpsStarted(httpsReadyMsg + httpsPortMsg));
				}

			}

		} else {
			waitForServers--;
		}

		process.on('uncaughtException', function (e) {
			if (e.code === 'EADDRINUSE') {
				console.log(dashes +
					seminarjs.get('name') + ' failed to start: address already in use\n' +
					'Please check you are not already running a server on the specified port.\n');
				process.exit();
			}
			/* else if (e.code === 'ECONNRESET') {
				// Connection reset by peer, ignore it instead of exiting server with a throw.
				// Disabled for release 0.2.16 while further research is being done.
				console.log('Connection reset by peer');
				console.log(e);
			} */
			else {
				console.log(e.stack || e);
				process.exit(1);
			}
		});

	};

	//mount the express app
	this.mount(events);

	return this;

}

module.exports = start;