/**
 * @module api
 * @desc Module for loading apis
 */


var fs = require('fs');
var path = require('path');


function setup(router, callback) {

	// tries to require api directories and run setup functions if they exist
	fs.readdir(__dirname, function (error, files) {
		if (error) {
			return callback(error);
		}

		try {
			files.forEach(function (name) {
				var file = path.join(__dirname, name);
				var isDir = fs.statSync(file).isDirectory();

				if (!isDir) {
					return;
				}

				var module = require(file);

				if (typeof module.setup === 'function') {
					module.setup(router);
				}
			});
		} catch (err) {
			return callback(err);
		}

		return callback();
	});

}


/** exports **/

exports.setup = setup;

