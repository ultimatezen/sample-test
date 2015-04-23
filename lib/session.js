/**
 * @module session
 * @desc Simple session module with optional ttl
 */


var moment = require('moment');


var sessionMap = {};


/**
 * @function session/set
 * @desc Sets a session
 *
 * @param {string} token - session token
 * @param {object} user - user object
 * @param {number} ttl - ttl in seconds
 */
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


/**
 * @function session/get
 * @desc Get a session by token
 *
 * @param {string} token - session token
 * @return {object} session - session object
 */
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


/**
 * @function session/del
 * @desc Deletes a session
 *
 * @param {string} token - session token
 */
function del(token) {

	delete sessionMap[token];

}


/**
 * @function session/flush
 * @desc Clears all sessions
 */
function flush() {

	sessionMap = {};

}


/** exports **/

exports.set = set;
exports.get = get;
exports.del = del;
exports.flush = flush;

