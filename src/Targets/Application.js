const { Target } = require('./Target.js');

class Application extends Target
{
	constructor(name = "Application") {
		super(name);
	}
};

module.exports = { Application };