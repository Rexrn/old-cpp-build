let cppBuild = {};

Object.assign(cppBuild,
		require('./Generators'),
		require('./Targets'),
		require('./Commands'),
		require('./Common'),
		{
			util: require('./Utility'),

			export(context, targetTemplate) {
				targetTemplate.scriptDirectory = context.path;
				context.exports = targetTemplate;
			}
		}
	);

module.exports = cppBuild;