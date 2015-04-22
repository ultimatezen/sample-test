/**
 * @module users/reserve
 * @desc users/reserve API handler
 */


var pool = require('../../database').pool;
var session = require('../../session');


function *tryReserve(userId, eventId) {

	var result = {
		code: 200,
		message: 'Reserved!'
	};

	function onError(err) {

		result.code = 500;
		result.message = 'Unknown Error!';

		if (err.code === 'ER_DUP_ENTRY') {
			result.code = 501;
			result.message = 'Already Registered!';
		}

	}

	var sql = 'INSERT INTO attends (user_id, event_id) VALUES (?, ?)';
	var params = [ userId, eventId ];
	
	yield pool.query(sql, params).catch(onError);

	return result;

}


function *tryUnreserve(userId, eventId) {

	var result = {
		code: 200,
		message: 'Unreserved!'
	};

	function onError() {

		result.code = 500;
		result.message = 'Unknown Error!';
		return result;

	}

	var sql = 'DELETE FROM attends WHERE user_id = ? AND event_id = ?';
	var params = [ userId, eventId ];
	var info = yield pool.query(sql, params).catch(onError);

	if (info.affectedRows !== 1) {
		result.code = 502;
		result.message = 'Not Reserved!';
	}

	return result;

}


function *reserve(next) {

	var body = this.request.body;
	var token = body.token;
	var eventId = body.event_id;
	var isReserve = body.reserve === 'true';
	var userSession = session.get(token);

	if (!userSession) {
		this.body.code = 401;
		this.body.message = 'You must be logged in!';
		return yield next;
	}

	if (userSession.user.group_id !== 1) {
		this.body.code = 401;
		this.body.message = 'Only students may reserve!';
		return yield next;
	}

	var userId = userSession.user.id;
	var result;

	if (isReserve) {
		result = yield tryReserve(userId, eventId);
	} else {
		result = yield tryUnreserve(userId, eventId);
	}

	this.body.code = result.code;
	this.body.message = result.message;

	return yield next;

}


/** exports **/

module.exports = reserve;

