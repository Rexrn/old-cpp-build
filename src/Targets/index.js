let targets = {};

Object.assign(targets,
		require('./BuildContext.js'),
		require('./Target.js'),
		require('./Application.js'),
		require('./StaticLibrary.js'),
		require('./SharedLibrary.js'),
		require('./TargetGroup.js')
	);

module.exports = targets;