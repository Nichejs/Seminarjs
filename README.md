Seminarjs
=========

[![Build Status](https://travis-ci.org/Nichejs/Seminarjs.svg?branch=master)](https://travis-ci.org/Nichejs/Seminarjs)
[![Dependency Status](https://www.versioneye.com/user/projects/542c5277fc3f5c949d000179/badge.svg?style=flat)](https://www.versioneye.com/user/projects/542c5277fc3f5c949d000179)

> Live Seminar system, specially designed for programming/technology courses.

##Installation
You will need to install Nodejs in order to run Seminarjs.

Browse to the folder where your course will be setup, and run the following:

```
npm install seminarjs --save
```

Once this has run, create an entry point (`index.js`) is the usual, and include the following:

```javascript
var seminarjs = require('seminarjs');

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

seminarjs.set('routes', require('./private/routes'));

seminarjs.start();
```

##Plugins

Seminarjs can be easily extended with plugins, which only require two steps to install and run.

First install the plugin package:

```
npm install seminarjs-{plugin} --save
```

Next, add the following after `seminarjs.start();`:

```javascript
seminarjs.loadPlugin('{plugin}');
```

###Official plugins

This is the list of plugins developed by the Seminarjs team, go to their repositories for their documentation and usage.

* Chat: [seminarjs-chat](https://github.com/Nichejs/Seminarjs-Chat)
* Contest: [seminarjs-contest](https://github.com/Nichejs/Seminarjs-Contest)

###Plugins

If you develop a plugin for Seminarjs please feel free to send a Pull Request adding your plugin here, or add an issue referencing your plugin repository.

It should be available as an npm package and work in the same way the other plugins work.

##Contributing

Please feel free to add any issues you find with Seminarjs or any of its plugins.

Code contributions are also welcome, if you want to add anything please do the following:

1. Fork the project.
2. Create a new feature branch from `develop`.
3. Add tests for you new feature in the `test` folder (and make sure it passes them, and all existing ones)
4. Send a pull request to the `develop` branch.

If your Pull request resolves any existing issues please also reference them in the PR message.

##License
Seminarjs is released under the MIT License
