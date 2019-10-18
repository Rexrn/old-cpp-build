/**
 * Generates build files for specified target.
 * @class Generator
 */
class Generator
{
	/**
	 * Initializes instance of the @see Generator class.
	 * @param {*} config 
	 */
	constructor()
	{
	}

	configure(config)
	{
		this.config = config;
	}

	/**
	 * Generates build files for specified target.
	 * @param {Target} target 
	 */
	generate(target)
	{

	}

	/**
	 * Generates and returns default configuration.
	 * @returns configuration.
	 * @memberof Generator
	 */
	getDefaultConfiguration()
	{
		return {};
	}

	/**
	 * Returns build command to start build script.
	 * @returns build command and required working directory.
	 * @memberof Generator
	 */
	getBuildCommand()
	{
		return {
				workingDirectory: ".",
				command: 'echo Nothing to do'
			};
	}


	/**
	 * Returns main build file name for specified target name.
	 * @param {*} targetName
	 * @returns main build file name.
	 * @memberof Generator
	 */
	getBuildFileNameForTarget(targetName)
	{
		return targetName;
	}
};

module.exports = { Generator };