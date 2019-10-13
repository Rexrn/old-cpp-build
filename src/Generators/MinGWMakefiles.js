const Generator = require('./Generator.js');
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

		let fileName = this.getBuildFileNameForTarget(target.name);
		let fileContents = "";

		fileContents += "all:\n"

		// Prepare build command:
		{
			let incDirsStr = "";
			let srcFilesStr = "";
			let libsStr = "";

			if ( Array.isArray(target.includeDirectories) )
				incDirsStr = this.prepareIncludeDirs(target.includeDirectories);

			if ( Array.isArray(target.files) )
				srcFilesStr = this.prepareSourceFiles(target.files);

			if ( Array.isArray(target.linkedLibraries) )
				libsStr = this.prepareLinkedLibraries(target.linkedLibraries);

			fileContents += `\t${this.config.cppCompiler} ${incDirsStr} ${srcFilesStr} ${libsStr} -o ${target.name}`;
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

	prepareSourceFiles(files)
	{
		let str = "";
		for(let file of files)
		{
			if (typeof file == 'string')
			{
				if (file.endsWith(".cpp") || file.endsWith(".c") || file.endsWith(".cc") || file.endsWith(".cxx"))
				{
					file = path.resolve( this.config.targetScriptDirectory, file );
					str += `"${file}" `
				}
			}
			else {
				console.error('Invalid file: ', file);
			}
		}
		return str.trimRight();
	}
};


module.exports = MinGWMakefilesGenerator;