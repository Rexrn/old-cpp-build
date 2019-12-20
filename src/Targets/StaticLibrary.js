const { Target, TargetType } = require('./Target.js');

class StaticLibrary extends Target
{
	constructor(name = "StaticLibrary") {
		super(name, TargetType.StaticLibrary);
	}
};

module.exports = { StaticLibrary };