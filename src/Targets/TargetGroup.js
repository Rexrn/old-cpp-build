const { Target } = require('./Target.js');

class TargetGroup extends Target
{
	constructor(name = "TargetGroup", targets = [])
	{
		super(name);

		if (!Array.isArray(targets))
			throw "targets must be an array";

		this.children = targets;
	}
};

module.exports = { TargetGroup };