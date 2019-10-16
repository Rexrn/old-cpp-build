let util = {};

Object.assign(util,
		require('./Build.js'),
		require('./Path.js')
	);

module.exports = util;