let cppBuild = {};

Object.assign(cppBuild,
		{
			version: '0.0.1',
		},
		require('./Generators.js'),
		require('./Commands.js'),
		{
			util: require('./Utility.js')
		}
	);

module.exports = cppBuild;