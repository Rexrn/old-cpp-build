const cfgStep = require("./Configure.js");
const genStep = require("./Generate.js");
const buildStep = require("./Build.js");
const { TargetGroup } = require("../Targets");

const path = require("path");

module.exports = {
    run(args) {

        let cbConfig = {};
        try {
            cbConfig = this.parseArgs(args);
        }
        catch(e) {
            if (e.stack)
                console.error(e.stack);
            throw `could not parse program arguments: ${e}`;
        }

        let target = {};
        try {
            target = require( path.resolve(process.cwd(), cbConfig.targetScript) );
        }
        catch(e) {
            throw `could not load and execute target script ("${cbConfig.targetScript}"): ${e}`;
        }

        if (cbConfig.generator)
        {
            cbConfig.generator.instance = new cbConfig.generator.impl();
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

                cfgStep.configure(cbConfig.generator.instance, true);
                break;
            case "generate":
                // load configuration (call configure if config not exists)
                // generate build files
                {
                    let generator = cbConfig.generator.instance;
                    cfgStep.configure(generator);
                    genStep.generate(target, generator);
                }
                break;

            case "build":
                // TODO: load "generate_result.json"
                {
                    let generator = cbConfig.generator.instance;
                    cfgStep.configure(generator);
                    
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

            let parseGeneratorHelper = (target, arg, opt = true) =>
                {
                    let gen = this.parseGeneratorFromArgument(arg);
                    if (gen)
                        target = gen;
                    else if (!opt)
                        throw `argument "${arg}" doesn't contain valid generator`;
                };
            for(let i = 3; i < args.length; ++i)
            {
                if (args[i].startsWith('--generator') || args[i].startsWith('-G'))
                {
                    parseGeneratorHelper(cbConfig.generator, args[i], false);
                }
                else if (args[i].startsWith('--configure') || args[i].startsWith('-c'))
                {
                    cbConfig.configure = true;
                    parseGeneratorHelper(cbConfig.generator, args[i]);
                }
                else if (args[i].startsWith('--generate') || args[i].startsWith('-g'))
                {
                    cbConfig.generate = true;
                    parseGeneratorHelper(cbConfig.generator, args[i]);
                }
                else if (args[i].startsWith('--build') || args[i].startsWith('-b'))
                {
                    cbConfig.build = true;
                }
                else if (args[i].startsWith('--install') || args[i].startsWith('-i'))
                {
                    cbConfig.install = true;
                }
                else
                    console.warn(`Skipping unrecognised argument: "${args[i]}"`)
            }

            // TODO: check if generator is necessary for specified params.
            cbConfig.generator = cbConfig.generator || genStep.getDefaultGenerator();
        }

        return cbConfig;
    },
    parseGeneratorFromArgument(paramValue)
    {
        // Check has format '-param=GenName'
        let equalsIndex = paramValue.indexOf('=');
        if (equalsIndex != -1)
        {
            let genName = paramValue.substr(equalsIndex + 1);

            // Strip from quotes
            //
            // Note: unnecessary, node automatically strips this.
            // Not sure if other environments do this though.
            //
            // if (genName.startsWith("\"") && genName.endsWith("\""))
            //     genName = genName.substr(1, genName.length - 2);

            // Try to find the generator and validate it.
            let gen = genStep.findGenerator(genName);

            if (!gen)
                throw "invalid or unsupported generator";

            return gen;
        }
    }
   
};