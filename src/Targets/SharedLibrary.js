const { Target } = require('./Target.js');

class SharedLibrary extends Target
{
	constructor(name = "SharedLibrary") {
		super(name);
	}
};

module.exports = { SharedLibrary };