const cfgStep = require("./Configure.js");
const genStep = require("./Generate.js");
const buildStep = require("./Build.js");
const path = require("path");

module.exports = {
    run(args) {

        let cbConfig = {};
        try {
            cbConfig = this.parseArgs(args);
        }
        catch(e) {
            throw `could not parse program arguments: ${e}`;
        }

        let target = {};
        try {
            target = require( path.resolve(process.cwd(), cbConfig.targetScript) );
        }
        catch(e) {
            throw `could not load and execute target script ("${cbConfig.targetScript}"): ${e}`;
        }

        console.log(`# Running build process`);
        if (cbConfig.configure)
            this.executeCommand("configure", target, cbConfig);
        if (cbConfig.generate)
            this.executeCommand("generate", target, cbConfig);
        if (cbConfig.build)
            this.executeCommand("build", target, cbConfig);
        if (cbConfig.install)
            this.executeCommand("install", target, cbConfig);
    },
    executeCommand(command, target, cbConfig)
    {
        try {
            switch(command)
            {
            case "configure":
                // remove old configuration file
                // generate new, default configuration
                // save new configuration
                cfgStep.configure(true);
                break;
            case "generate":
                // load configuration (call configure if config not exists)
                // generate build files
                {
                    let generationConfig = cfgStep.configure();
                    generationConfig.targetScriptDirectory = path.dirname( path.resolve(process.cwd(), cbConfig.targetScript) );
                    let generator = new cbConfig.generator.impl(generationConfig);
                    genStep.generate(target, generator);
                }
                break;

            case "build":
                // TODO: load "generate_result.json"
                {
                    let generationConfig = cfgStep.configure();
                    generationConfig.targetScriptDirectory = path.dirname( path.resolve(process.cwd(), cbConfig.targetScript) );
                    let generator = new cbConfig.generator.impl(generationConfig);
                    
                    buildStep.build(target, generator);
                }
                break;
                
            case "install":
                // execute install script
                throw "not implemented";
                break;
            default:
                throw "invalid command";
            }
        }
        catch(e) {
            throw `${command} command failed: ${e}`;
        }
    },
    parseArgs(args)
    {
        const fs = require("fs");

        let cbConfig = {};
        // TODO: implement this.

        if (args < 3)
        {
            throw "nothing to do";
        }
        else
        {
            let targetFileName = args[2];
            if ( fs.existsSync(targetFileName) )
            {
                if (!targetFileName.endsWith(".js"))
                    console.warn("Target script is expected to have \".js\" extension.");

                cbConfig.targetScript = targetFileName;
            }
            else
                throw `target script ("${targetFileName}") does not exist`;

            for(let i = 3; i < args.length; ++i)
            {
                if (args[i] == '--configure' || args[i] == '-c')
                    cbConfig.configure = true;
                else if (args[i].startsWith('--generate') || args[i].startsWith('-g'))
                {
                    cbConfig.generate = true;

                    let gen = genStep.getDefaultGenerator();

                    // parse generator name
                    {
                        // Check has format '-g=GenName'
                        let equalsIndex = args[i].indexOf('=');
                        if (equalsIndex != -1)
                        {
                            let genName = args[i].substr(equalsIndex + 1);

                            // Strip from quotes
                            //
                            // Note: unnecessary, node automatically strips this.
                            // Not sure if other environments do this though.
                            //
                            // if (genName.startsWith("\"") && genName.endsWith("\""))
                            //     genName = genName.substr(1, genName.length - 2);

                            // Try to find the generator and validate it.
                            gen = genStep.findGenerator(genName);

                            if (!gen)
                                throw "invalid or unsupported generator";
                        }
                    }

                    cbConfig.generator = gen;
                }
                else if (args[i] == '--build' || args[i] == '-b')
                    cbConfig.build = true;
                else if (args[i] == '--install' || args[i] == '-i')
                    cbConfig.install = true;
                else
                    console.warn(`Skipping unrecognised argument: "${args[i]}"`)
            }
        }

        return cbConfig;
    },
    exportFromTemplate(targetTemplate) {
        return targetTemplate;
    }
};