/**
 * Seminarjs Server code
 */
var express = require('express');;
var fs = require('fs');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Plugins
var chat = require("./private/plugins/chat-server.js");

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	res.setHeader('Content-Type', 'text/HTML');
	res.send('Hello World');
});

server.listen(app.get('port'), function () {
	console.log('Node server is running at localhost:' + app.get('port'))
});

chat(io);