let generators = {};

Object.assign(generators,
		require('./Generator.js'),
		require('./MinGWMakefiles.js'),
		require('./GCCFlags.js')
	);

module.exports = generators;