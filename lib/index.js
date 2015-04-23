/**
 * @file Main entry point for the app
 */


var koa = require('koa');
var KoaRouter = require('koa-router');
var config = require('../spec/config/config.json');

var api = require('./api');

var app = koa();
var apiRouter = new KoaRouter({ prefix: '/api' });


// set response type to json
app.use(function * (next) {

	this.res.type = 'application/json';
	this.body = {};
	yield next;

});


// setup apis and register routes
api.setup(apiRouter, function (err) {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	app.use(apiRouter.routes());

	var port = config.port;
	app.listen(port);
	console.log('Server started on port:', port);

});

