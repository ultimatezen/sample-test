/**
 * @file users/events API handler
 */


var moment = require('moment');
var pool = require('../../database').pool;


// process and sort the results from db
function processRows(rows) {

	var results = rows.map(function (row) {
		var result = {
			id: row.id,
			name: row.ename,
			start_date: moment(row.start_date).format('YYYY-MM-DD HH:mm:ss'),
			company: {
				id: row.user_id,
				name: row.name
			}
		};

		return result;
	});

	results.sort(function (a, b) {
		return moment(a.start_date).unix() > moment(b.start_date).unix();
	});

	return results;

}


/**
 * @function users/events
 * @desc Get a list of events with date/limit/offset
 *
 * @param {string} from - date to search from
 * @param {number} offset - offset for results
 * @param {number} limit - limit results to
 * @return {number} code - status code
 * @return {object[]} events - array of events
 */
function *events(next) {

	// grab all params
	var body = this.request.query;
	var from = body.from;
	var offset = parseInt(body.offset, 10) || 0;
	var limit = parseInt(body.limit, 10);

	if (!from) {
		this.res.statusCode = 400;
		return yield next;
	}

	if (!isNaN(limit) && limit === 0) {
		this.res.statusCode = 400;
		return yield next;
	}

	var sql = 'SELECT e.id, e.user_id, e.name AS ename, e.start_date, u.name FROM events AS e, users AS u WHERE e.user_id = u.id AND start_date >= ?';
	var params = [ from ];

	if (offset || limit) {
		sql += ' LIMIT ?, ?';
		params.push(offset);
		// if limit is not defined, use a big number
		params.push(limit || 2147483647);
	}

	var rows = yield pool.query(sql, params);
	var results = processRows(rows);

	this.body = {
		code: 200,
		events: results
	};

	return yield next;
	
}


/** exports **/

module.exports = events;

