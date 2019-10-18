module.exports = {
	/**
	 * Name of the generation configuration file.
	 * It is placed inside build folder.
	 */
	configurationFileName: "config.json",

	/**
	 * Performs configuration step (--configure).
	 * @param {boolean} force - set to true if you want to remove old configuration and replace it with a default one. 
	 */
	configure(generator, force = false)
    {
        const fs = require("fs");

        let configFileExists = fs.existsSync(this.configurationFileName);

        // Remove configuration file
        if (force && configFileExists)
        {
            fs.unlinkSync(this.configurationFileName);
            configFileExists = false;
        }

        // Load or generate configuration
        if (configFileExists) {
            generationConfig = this.readConfigurationFile(this.configurationFileName);
        }
        else {
            generationConfig = generator.getDefaultConfiguration();
            this.saveConfigurationFile(generationConfig, this.configurationFileName);
        }

        // Validate configuration
        try {
            this.validateConfiguration(generationConfig);
        }
        catch(e) {
            throw `invalid configuration: ${e}`;
            return false;
        }

		generator.configure(generationConfig);
        return generationConfig;
	},

	/**
	 * Saves generation config to a file.
	 * @param {*} configuration 
	 * @param {*} fileName 
	 */
	saveConfigurationFile(configuration, fileName)
	{
        const fs = require("fs");
        fs.writeFileSync(fileName, JSON.stringify(configuration, null, "\t"));
	},
	
	/**
	 * Reads generation config file.
	 * @param {string} fileName - path to the configuration file.
	 */
	readConfigurationFile(fileName)
	{
        return JSON.parse(require("fs").readFileSync(fileName));
	},
	
	/**
	 * Determines whether generation config is valid.
	 * Throws if not.
	 * @param {object} configuration 
	 */
	validateConfiguration(configuration)
	{
        //throw 'not implemented';
    }
};