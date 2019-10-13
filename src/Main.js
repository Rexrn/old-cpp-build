let cppBuild = {};

Object.assign(cppBuild,
		require('./Generators'),
		require('./Targets'),
		require('./Commands'),
		require('./Common'),
		{
			util: require('./Utility')
		}
	);

module.exports = cppBuild;