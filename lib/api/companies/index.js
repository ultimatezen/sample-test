/**
 * @file Entry point for companies api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.post('/companies/events', koaBody(), require('./events'));

}


/** exports **/

exports.setup = setup;

