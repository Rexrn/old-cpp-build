class Target
{
	constructor(name)
	{
		this.name = name;
		this.includeDirectories = [];
		this.libraryDirectories = [];
		this.files = [];
	}
};

module.exports = { Target };