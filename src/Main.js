let cppBuild = {};

Object.assign(cppBuild,
		require('./Generators'),
		require('./Targets'),
		require('./Commands'),
		require('./Common'),
		{
			util: require('./Utility'),

			export(targetTemplate) {
				targetTemplate.scriptDirectory = module.parent.filename;
				return targetTemplate;
			}
		}
	);

module.exports = cppBuild;