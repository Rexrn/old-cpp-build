const g = require("../Generators");

module.exports = {
	availableGenerators: [
        {
            name: "MinGW Makefiles",
            impl: g.MinGWMakefilesGenerator,
        }
	],
	
	/**
	 * Performs generation step (--generate).
	 * @param {object} target - target to generate
	 * @param {*} generator - configured generator of the build files
	 */
	generate(target, generator)
	{
		// TODO: implement this.
        // throw "not implemented";
        require("../Utility").generateFromTargetTemplate(generator, target);
	},

	getDefaultGenerator()
	{
		if (this.availableGenerators.length == 0)
			throw "no generators are available";
		return this.availableGenerators[0];
	},

	findGenerator(name)
	{
		let foundGen = this.availableGenerators.find(
				v => v.name.toLowerCase() == name.toLowerCase()
			);

		if (foundGen)
			return foundGen;
	}
};