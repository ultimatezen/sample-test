/**
 * @module auth
 * @desc auth module
 */


var koaBody = require('koa-body');
var crypto = require('crypto');
var wrapper = require('co-mysql');
var mysql = require('mysql');
var config = require('../../../spec/config/config.json');
var pool = mysql.createPool(config.database.connection);
var wPool = wrapper(pool);


function *login(next) {

	var body = this.request.body;
	var email = body.email;
	var password = body.password;
	var hash = crypto.createHash('sha1').update(password).digest('hex');

	var sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
	var params = [ email, hash ];

	var rows = yield wPool.query(sql, params);
	var result = rows.pop();

	if (!result) {
		this.body.code = 500;
		return yield next;
	}

	var id = result.id;
	var name = result.name;
	var groupId = result.group_id;
	var token = crypto.createHash('sha1').update(id + name + groupId + Date.now()).digest('hex');

	var user = {
		id: id,
		name: name,
		group_id: groupId
	};

	this.body = {
		code: 200,
		token: token,
		user: user
	};

	return yield next;

}


function setup(router) {

	router.post('/auth/login', koaBody(), login);

}


/** exports **/

exports.setup = setup;
