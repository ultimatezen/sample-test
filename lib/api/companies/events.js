/**
 * @file companies/events API handler
 */


var moment = require('moment');
var pool = require('../../database').pool;
var session = require('../../session');


// process and sort the results from db
function processRows(rows) {

	rows.forEach(function (row) {
		row.start_date = moment(row.start_date).format('YYYY-MM-DD HH:mm:ss');
	});

	rows.sort(function (a, b) {
		return moment(a.start_date).unix() > moment(b.start_date).unix();
	});

	return rows;

}


/**
 * @function companies/events
 * @desc Get a list of events with date/limit/offset
 *
 * @param {string} token - session token
 * @param {string} from - date to search from
 * @param {number} offset - offset for results
 * @param {number} limit - limit results to
 * @return {number} code - status code
 * @return {object[]} events - array of events
 */
function *events(next) {

	// grab all params
	var body = this.request.body;
	var token = body.token;
	var from = body.from;
	var offset = parseInt(body.offset, 10) || 0;
	var limit = parseInt(body.limit, 10);
	var userSession = session.get(token);

	if (!userSession) {
		this.body.code = 401;
		return yield next;
	}

	if (userSession.user.group_id !== 2) {
		this.body.code = 401;
		return yield next;
	}

	if (!from) {
		this.res.statusCode = 400;
		return yield next;
	}

	if (!isNaN(limit) && limit === 0) {
		this.res.statusCode = 400;
		return yield next;
	}

	var result = {
		code: 200,
		events: []
	};

	function onError(err) {
		console.error(err);
		result.code = 500;
	}

	var userId = userSession.user.id;

	var params = [ userId, from ];
	var sql = 'SELECT e.id, e.name, e.start_date, COUNT(a.event_id) AS number_of_attendees';
	sql += ' FROM events AS e LEFT JOIN attends AS a ON e.id = a.event_id WHERE e.user_id = ? AND  e.start_date >= ?';
	sql += ' GROUP BY e.id';

	if (offset || limit) {
		sql += ' LIMIT ?, ?';
		params.push(offset);
		// if limit is not defined, use a big number
		params.push(limit || 2147483647);
	}

	var rows = yield pool.query(sql, params).catch(onError);

	if (result.code !== 500) {
		rows = processRows(rows);
		result.events = rows;
	}

	this.body = result;

	return yield next;

}


/** exports **/

module.exports = events;

