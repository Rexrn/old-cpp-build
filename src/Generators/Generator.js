class Generator
{
	constructor(config = {}) {
		this.config = config;
	}
	generate(target) {}
	getBuildCommand() {
		return {
				workingDirectory: ".",
				command: 'echo Nothing to do'
			};
	}
	getBuildFileNameForTarget(targetName) { return targetName; }
};

module.exports = Generator;