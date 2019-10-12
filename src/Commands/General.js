module.exports = {
    run(args) {
        console.log("# Running build process: ", args);

        let cbConfig = this.parseArgs(args);

        let buildConfig = {};
        if (cbConfig.cleanConfiguration) {
            this.cleanConfiguration(cbConfig.configurationFile);
        }
        else
        {
            buildConfig = this.readConfiguration(cbConfig.configurationFile);
            try {
                this.validateConfiguration(buildConfig);
            }
            catch(e) {
                throw `invalid configuration: ${e}`;
                return false;
            }
        }       

        

        // TODO:
        // - configure
        // - generate build files
        // - build
        // - install
    },
    parseArgs(args) {
        // TODO: implement this.
        return {};
    },
    readConfiguration(configurationFile) {
        return {};
    },
    cleanConfiguration(configurationFile) {
        // TODO: implement this.
    },
    validateConfiguration(configuration) {
        throw 'not implemented';
    },
    exportFromTemplate(targetTemplate) {
        return targetTemplate;
    }
};