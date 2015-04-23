/**
 * @file Entry point for users api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.get('/users/events', require('./events'));
	router.post('/users/reserve', koaBody(), require('./reserve'));

}


/** exports **/

exports.setup = setup;

