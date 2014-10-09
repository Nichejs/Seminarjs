/*
File with general data for the app
*/

var App = function () {
	//Loading env variables
	var dotenv = require('dotenv');
	dotenv.load();

	var express = require('express');
	App.fs = require('fs');
	App.express = express();
	//Set the public content
	App.express.use(express.static(__dirname.replace(/config/, 'views')));
	//midellware to read user request to the server
	var bodyParser = require('body-parser');
	App.express.use(bodyParser.urlencoded({
		extended: true
	}));

	//Connect to the database
	App.mongoose = require('mongoose');
	var configDB = require('./database.js');
	App.mongoose.connect(configDB.url);

	//Loading profile for users
	App.user = require('../app/models/user');

	//Giving access to underscore library
	App._ = require('underscore');

	App.server = require('http').Server(App.express);

	App.io = require('socket.io')(App.server);
	App.auth = require('../app/plugins/auth.js');
	App.auth.init(App);
	App.express.set('port', (process.env.PORT || 5000));
	App.express.set('view engine', 'ejs');
	App.server.listen(App.express.get('port'), function () {
		console.log('Node server is running at localhost:' + App.express.get('port'))
	});


	require('../app/routes.js')(App);

}
module.exports = App;