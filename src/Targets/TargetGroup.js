const { BuildContext } = require('./BuildContext.js');

class TargetGroup extends BuildContext
{
	constructor(name = "TargetGroup", targets = [])
	{
		super(name);

		if (!Array.isArray(targets))
			throw "targets must be an array";

		this.targets = targets;
	}
};

module.exports = { TargetGroup };