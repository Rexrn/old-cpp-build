const { Target, TargetType } = require('./Target.js');

class Application extends Target
{
	constructor(name = "Application") {
		super(name, TargetType.Application);
	}
};

module.exports = { Application };