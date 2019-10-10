const GCCGenerator = require('../Generators/GCC.js');
const { validateTarget } = require('../Common/TargetValidation.js');

const child_process = require('child_process');
const path = require('path');


module.exports = {
	generateFromTargetTemplate: function(generator, template)
	{
		try {
			validateTarget(template);
		}
		catch(e) {
			console.error(`Target validation failed: ${e}`);
			return false;
		}
		generator.generate(template);
	},

	buildForGenerator(generator, template)
	{
		console.log(`# Building target "${template.name}"`);

		let buildFile = generator.getBuildFileNameForTarget(template.name);
		let buildProcess = child_process.spawn(`.${path.sep}${buildFile}`);
		buildProcess.stdout.on('data', function(data) {
				console.log(data.toString());
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
	},
	
	// Simplified build function
	build(template) {
		let generator = new GCCGenerator();
		this.generateAndBuildFromTemplate(generator, template);
	}
};