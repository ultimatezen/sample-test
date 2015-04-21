var koa = require('koa');
var KoaRouter = require('koa-router');
var session = require('koa-session');
var config = require('../spec/config/config.json');

var modules = require('./modules');


var app = koa();
var apiRouter = new KoaRouter({ prefix: '/api' });


app.use(session(app));


app.use(function * (next) {
	this.res.type = 'application/json';
	this.body = {};
	yield next;
});


modules.setup(apiRouter, function (err) {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	app.use(apiRouter.routes());

	var port = config.port;
	app.listen(port);
	console.log('Server started on port:', port);
});

