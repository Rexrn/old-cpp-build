const { validateTarget } = require('../Common/TargetValidation.js');

const child_process = require('child_process');
const path = require('path');


module.exports = {
	generateFromTargetTemplate(generator, template)
	{
		try {
			validateTarget(template);
		}
		catch(e) {
			throw `target validation failed: ${e}`;
		}
		generator.generate(template);
	},

	buildForGenerator(generator, template)
	{
		console.log(`# Building target "${template.name}"`);

		let buildCommand = generator.getBuildCommand();

		let buildProcess = child_process.spawn(buildCommand.command,
				{
					cwd: buildCommand.workingDirectory || '.'
				}
			);

		buildProcess.stdout.on('data', function(data) {
				console.log(data.toString());
			});
		buildProcess.stderr.on('data', function(data) {
				console.error(data.toString());
			});
		buildProcess.on('close', function(code, signal) {
				let result = (code === 0) ? 'success' : 'failure/unknown'
				console.log(`Ended building target "${template.name}" (${result})`);
			});
	},

	generateAndBuildFromTemplate(generator, template)
	{
		this.generateFromTargetTemplate(generator, template);
		this.buildForGenerator(generator, template);
	}
};