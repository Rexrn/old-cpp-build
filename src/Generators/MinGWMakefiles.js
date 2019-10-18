const { Generator } = require('./Generator.js');
const { TargetGroup, Target, StaticLibrary } = require("../Targets");
const { gccFlags } = require("./GCCFlags.js");
const { pathRequiresQuotes } = require("../Utility");

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

	/**
	 * Generates makefile for single target (or target group)
	 * @param {Target} target 
	 */
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
				let globalIncludeDirsDecl = "GLOBAL_INCLUDE_DIRS = ";
				if ( Array.isArray(target.includeDirectories) )
					globalIncludeDirsDecl += this.evaluateIncludeDirectories(target, target.includeDirectories);
				
				let globalLinkerDirsDecl = "GLOBAL_LINKER_DIRS = ";
				if ( Array.isArray(target.linkerDirectories) )
					globalLinkerDirsDecl += this.evaluateLinkerDirectories(target, target.linkerDirectories);

				// Prepare global libraries:
				let globalLibsDecl = "GLOBAL_LIBRARIES = ";
				if ( Array.isArray(target.linkedLibraries) )
					globalLibsDecl += this.evaluateLinkedLibraries(target, target.linkedLibraries);

				let libraryMode = target instanceof StaticLibrary;
				
				// Compose main target string(s).
				// For example:
				// TargetName: file1.o file2.o file3.o 		<--- str index 0
				// 		g++ file1.o file2.o file3.o			<--- str index 1
				let mainTargetStr = [
						`${target.name}: `,
						''
					];

				if (libraryMode)
				{
					mainTargetStr[1] = `\t${this.config.archiveTool} rvs ${target.name}.a `;
				}
				else
				{
					mainTargetStr[1] = `\t${this.config.cppCompiler} `;
				}

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
				if (!libraryMode)
					mainTargetStr[1] += ` $(GLOBAL_INCLUDE_DIRS) $(GLOBAL_LINKER_DIRS) $(GLOBAL_LIBRARIES) -o ${target.name}`;

				// Global declarations:
				fileContents += globalIncludeDirsDecl + '\n';
				fileContents += globalLinkerDirsDecl + '\n';
				fileContents += globalLibsDecl + '\n';

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

	/**
	 * Returns command required to build the generated files.
	 */
	getBuildCommand() {
		return {
				workingDirectory: ".",
				command: this.config.makeProgram || "make"
			};
	}

	/**
	 * Returns build filename.
	 */
	getBuildFileNameForTarget(targetName)
	{
		return "Makefile";
	}

	evaluateIncludeDirectories(target, dirs)
	{
		let str = " ";
		for(let dir of dirs)
		{
			if (typeof dir == 'string')
			{
				dir = path.resolve( target.scriptDirectory, dir );
				str += `-I"${dir}" `
			}
			else {
				console.error('Invalid directory: ', lib);
			}
		}
		return str.trimRight();
	}

	evaluateLinkerDirectories(dirs)
	{
		let str = " ";
		for(let dir of dirs)
		{
			if (typeof dir == 'string')
			{
				dir = path.resolve( target.scriptDirectory, dir );
				str += `-L"${dir}" `
			}
			else {
				console.error('Invalid directory: ', lib);
			}
		}
		return str.trimRight();
	}

	evaluateLinkedLibraries(target, libs)
	{
		let str = "";
		for(let lib of libs)
		{
			if (typeof lib == 'string')
			{
				lib = path.resolve( target.scriptDirectory, lib );
				str += ` "${lib}" `
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
			let fileExt = path.parse(file).ext;
			if (this.isSourceFile(fileExt))
			{
				let compiler 			= this.selectCompiler(fileName, fileSettings);
				let absolutePath 		= path.resolve( target.scriptDirectory, filePath );
				let evaluatedSettings 	= this.evaluateSettings(target, fileSettings);

				let actionStr = `${fileName}.o: ${absolutePath}\n`;
				actionStr += `\t${compiler} -c -std=c++17 $(GLOBAL_INCLUDE_DIRS) $(GLOBAL_LINKER_DIRS) ${evaluatedSettings} ${absolutePath}`;

				return actionStr;
			}
		}
		else {
			console.error('Invalid file: ', file);
		}
	}

	evaluateSettings(target, settings)
	{
		let str = "";
		if ( Array.isArray(settings.includeDirectories) )
			str += this.evaluateIncludeDirectories(target, target.includeDirectories);

		if ( Array.isArray(settings.linkerDirectories) )
			str += this.evaluateLinkerDirectories(target, target.linkerDirectories);

		if ( Array.isArray(settings.linkedLibraries) )
			str += " " + this.evaluateLinkedLibraries(target, target.linkedLibraries);
		
		return str;
	}

	selectCompiler(fileName, settings)
	{
		if (settings && settings.compiler)
			return settings.compiler;

		return fileName.endsWith(".c") ? this.config.cCompiler : this.config.cppCompiler;
	}
	isSourceFile(extension)
	{
		let ex = extension.toLowerCase();
		return (ex == ".cpp" || ex == ".c" || ex == ".cc" || ex == ".cxx");
	}
};


module.exports = { MinGWMakefilesGenerator };