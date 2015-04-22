/**
 * @module auth
 * @desc Entry point for auth module
 */


var koaBody = require('koa-body');


function setup(router) {

	router.post('/auth/login', koaBody(), require('./login'));

}


/** exports **/

exports.setup = setup;

