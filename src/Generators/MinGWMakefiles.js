const { Generator } = require('./Generator.js');
const { TargetGroup, Target } = require("../Targets");
const { gccFlags } = require("./GCCFlags.js");

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
				if (!fs.existsSync(child.name))
					fs.mkdirSync( child.name );
				
				process.chdir( child.name );
				this.generate(child);
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
				// Prepare global includes:
				let globalIncludesDecl = "GLOBAL_INCLUDES = ";
				if ( Array.isArray(target.includeDirectories) )
					globalIncludesDecl += this.prepareIncludeDirs(target.includeDirectories);

				// Prepare global libraries:
				let globalLibsStr = "GLOBAL_LIBRARIES = ";
				if ( Array.isArray(target.linkedLibraries) )
					globalLibsStr += this.prepareLinkedLibraries(target.linkedLibraries);

				// Compose main target string(s).
				// For example:
				// TargetName: file1.o file2.o file3.o 		<--- str index 0
				// 		g++ file1.o file2.o file3.o			<--- str index 1
				let mainTargetStr = [
						`${target.name}: `,
						`\t${this.config.cppCompiler} `
					];

				// Compose source file actions string.
				// For example:
				// SrcFile1.o:
				//  	g++ absolute/path/to/SrcFile1.cpp
				// SrcFile2.o:
				//  	g++ absolute/path/to/SrcFile2.cpp
				// # etc
				let fileActionsStr = "";
				for(let file of target.files)
				{
					let fileAction = this.prepareFileAction(target, file);
					// Action generated successfully?
					if (fileAction)
					{
						let fileName = path.parse(file).name;

						// Append to the action label string:
						mainTargetStr[0] += `${fileName}.o `;
						// Append to the build command string:
						mainTargetStr[1] += `${fileName}.o `;

						// Append file action and new line:
						fileActionsStr += `${fileAction}\n`;
					}
				}

				// Apply global settings to the main target build command:
				mainTargetStr[1] += ` $(GLOBAL_INCLUDES) $(GLOBAL_LIBRARIES) -o ${target.name}`;

				// Global declarations:
				fileContents += globalIncludesDecl + '\n';
				fileContents += globalLibsStr + '\n';

				// Main target (action label and build cmd):
				fileContents += mainTargetStr[0] + '\n';
				fileContents += mainTargetStr[1] + '\n';

				// The rest (file actions):
				fileContents += fileActionsStr;
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
			let fileName = path.parse(file).name;
			if (this.isSourceFile(fileName))
			{
				let compiler 			= this.selectCompiler(fileName, fileSettings);
				let absolutePath 		= path.resolve( target.scriptDirectory, filePath );
				let evaluatedSettings 	= this.evaluateSettings(settings);

				let actionStr = `f_${fileName}.o: "${absolutePath}"\n`;
				actionStr += `\t${compiler} -c $(GLOBAL_INCLUDES) $(GLOBAL_LIBRARIES) ${evaluatedSettings} "${absolutePath}"`;

				return actionStr;
			}
		}
		else {
			console.error('Invalid file: ', file);
		}
	}

	evaluateSettings(settings)
	{
		let str = "";
		if ( Array.isArray(settings.includeDirectories) )
			str += this.prepareIncludeDirs(target.includeDirectories);

		if ( Array.isArray(settings.linkedLibraries) )
			str += " " + this.prepareLinkedLibraries(target.linkedLibraries);
		
		return str;
	}

	selectCompiler(fileName, settings)
	{
		if (settings && settings.compiler)
			return settings.compiler;

		return filePath.endsWith(".c") ? this.config.cCompiler : this.config.cppCompiler;
	}
	isSourceFile(fileName)
	{
		return (fileName.endsWith(".cpp") || fileName.endsWith(".c")
			|| fileName.endsWith(".cc") || fileName.endsWith(".cxx"));
	}
};


module.exports = { MinGWMakefilesGenerator };