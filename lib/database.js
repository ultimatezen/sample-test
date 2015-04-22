/**
 * @module database
 * @desc Some wrapper logic for pooling mysql connections
 */


var wrapper = require('co-mysql');
var mysql = require('mysql');
var config = require('../spec/config/config.json');
var pool = mysql.createPool(config.database.connection);
var wPool = wrapper(pool);


/** exports **/

exports.pool = wPool;

