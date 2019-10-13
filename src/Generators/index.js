let generators = {};

Object.assign(generators,
		require('./Generator.js'),
		require('./MinGWMakefiles.js')
	);

module.exports = generators;