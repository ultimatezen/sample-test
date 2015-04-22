/**
 * @module session
 * @desc session module
 */


var moment = require('moment');


var sessionMap = {};


function set(token, user, ttl) {
	
	var session = {
		token: token,
		user: user
	};

	if (ttl) {
		session.ttl = ttl + moment().unix();
	}


	sessionMap[token] = session;

}


function get(token) {

	var session = sessionMap[token];

	if (!session) {
		return null;
	}

	if (session.ttl && moment().unix() > session.ttl) {
		return null;
	}

	return session;
	
}


function del(token) {

	delete sessionMap[token];

}


function flush() {

	sessionMap = {};

}


/** exports **/

exports.set = set;
exports.get = get;
exports.del = del;
exports.flush = flush;

