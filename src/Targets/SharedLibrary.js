const { Target, TargetType } = require('./Target.js');

class SharedLibrary extends Target
{
	constructor(name = "SharedLibrary") {
		super(name, TargetType.SharedLibrary);
	}
};

module.exports = { SharedLibrary };