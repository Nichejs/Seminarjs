/**
 * Test the Express server running, requires the server to be running locally for the tests
 */
var should = require('should'),
	request = require('supertest');

describe('Express server', function () {
	describe('Get version', function () {
		it('should return the version', function (done) {
			request('http://localhost:5000')
				.get('/version')
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err)
					}

					var pjson = require('../package.json');

					if (res.body.version !== pjson.version) return done(err)
					done()
				})
		});
	});
});