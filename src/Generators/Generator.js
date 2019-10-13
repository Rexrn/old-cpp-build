class Generator
{
	constructor(config = {}) {
		this.config = config;
	}
	generate(target) {}
	getBuildFileNameForTarget(targetName) { return targetName; }
};

module.exports = Generator;