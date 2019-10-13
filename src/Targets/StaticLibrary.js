const { Target } = require('./Target.js');

class StaticLibrary extends Target
{
	constructor(name = "StaticLibrary") {
		super(name);
	}
};

module.exports = { StaticLibrary };