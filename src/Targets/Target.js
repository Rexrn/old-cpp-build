const { BuildContext } = require('./BuildContext');

const TargetType = {
	Unknown: 0,
	Application: 1,
	StaticLibrary: 2,
	SharedLibrary: 3
};

class Target extends BuildContext
{
	constructor(name, type = TargetType.Application)
	{
		super(name);
		this.type = type;
		this.includeDirectories = [];
		this.libraryDirectories = [];
		this.files = [];
	}
};

module.exports = { TargetType, Target };