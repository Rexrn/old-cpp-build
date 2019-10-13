const { Generator } = require('./Generator.js');
const { TargetGroup, Target } = require("../Targets");

const fs = require('fs');
const path = require("path");

class MinGWMakefilesGenerator extends Generator
{
	constructor(config = {})
	{
		super(config);
	}

	generate(target)
	{
		console.log(`# Generating build file for target "${target.name}"`)

		this.generateMakefile(target);

		if (target instanceof TargetGroup)
		{
			let prevWorkingDir = process.cwd();
			for(let child of target.targets)
			{
				fs.mkdirSync( child.name );
				process.chdir( child.name );
				
				this.generate(target);

				process.chdir(prevWorkingDir);
			}
		}
	}

	generateMakefile(target)
	{
		let fileName = this.getBuildFileNameForTarget(target.name);
		let fileContents = "";

		if (target instanceof TargetGroup)
		{
			let subtargets = "";

			for(let child of target.targets)
			{
				subtargets += `subtarget_${child.name} `;
				fileContents += `subtarget_${child.name}: ${child.name}/Makefile\n`;
				fileContents += `\t${this.config.makeProgram} -C ${child.name}\n`;
			}
			fileContents = `all: ${subtargets}\n${fileContents}`;
		}
		else if (target instanceof Target)
		{
			// Prepare build command:
			{
				let incDirsStr = "GLOBAL_INCLUDES = ";
				let libsStr = "GLOBAL_LIBRARIES = ";
				let srcFilesStr = "";


				if ( Array.isArray(target.includeDirectories) )
					incDirsStr += this.prepareIncludeDirs(target.includeDirectories);

				if ( Array.isArray(target.linkedLibraries) )
					libsStr += this.prepareLinkedLibraries(target.linkedLibraries);

				let mainTargetStr = [
						`${target.name}: `,
						`\t${this.config.cppCompiler} `
					];

				for(let file of target.files)
				{
					let fileAction = this.prepareFileAction(target, file);
					if (fileAction)
					{
						mainTargetStr[0] += 'f_' + path.parse(file).name + '.o ';
						mainTargetStr[1] += path.parse(file).name + '.o ';
						srcFilesStr += fileAction + '\n';
					}
				}
				mainTargetStr[1] += ` $(GLOBAL_INCLUDES) $(GLOBAL_LIBRARIES) -o ${target.name}\n`;

				fileContents += incDirsStr + '\n';
				fileContents += libsStr + '\n';
				fileContents += mainTargetStr[0] + '\n' + mainTargetStr[1];
				fileContents += srcFilesStr;

				// fileContents += `\t${this.config.cppCompiler} ${incDirsStr} ${srcFilesStr} ${libsStr} -o ${target.name}`;
			}
		}
		
		// Write build file:
		fs.writeFileSync(fileName, fileContents);

		console.log(`Build file written to: "${fileName}"`)
	}

	getBuildCommand() {
		return {
				workingDirectory: ".",
				command: this.config.makeProgram || "make"
			};
	}

	getBuildFileNameForTarget(targetName)
	{
		return `Makefile`;
	}

	prepareIncludeDirs(dirs)
	{
		let str = " ";
		for(let dir of dirs)
		{
			if (typeof dir == 'string')
			{
				dir = path.resolve( this.config.targetScriptDirectory, dir );
				str += `-I"${dir}" `
			}
			else {
				console.error('Invalid directory: ', lib);
			}
		}
		return str.trimRight();
	}

	prepareLinkedLibraries(libs)
	{
		let str = "";
		for(let lib of libs)
		{
			if (typeof lib == 'string')
			{
				str += `-l"${lib}" `
			}
			else {
				console.error('Invalid library: ', lib);
			}
		}
		return str.trimRight();
	}

	prepareFileAction(target, file)
	{
		let filePath = file.path || file;
		let fileSettings = file.settings || {};

		if (typeof filePath == 'string')
		{
			if (filePath.endsWith(".cpp") || filePath.endsWith(".c")
				|| filePath.endsWith(".cc") || filePath.endsWith(".cxx"))
			{
				let fileName = path.parse(file).name;
				let compiler = filePath.endsWith(".c") ? this.config.cCompiler : this.config.cppCompiler;

				let resolvedPath = path.resolve( target.scriptDirectory, filePath );

				let actionStr = `f_${fileName}.o: ${resolvedPath}\n`;
				actionStr += `\t${compiler} -c $(GLOBAL_INCLUDES) $(GLOBAL_LIBRARIES) ${resolvedPath}`;

				return actionStr;
			}
		}
		else {
			console.error('Invalid file: ', file);
		}
	}
};


module.exports = { MinGWMakefilesGenerator };