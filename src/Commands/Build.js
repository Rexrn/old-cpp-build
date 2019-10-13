module.exports = {

	/**
	 * Performs build step (--build) for specified target.
	 * @param {*} generator 
	 * @param {*} target 
	 */
	build(target, generator)
	{
		require("../Utility").buildForGenerator(generator, target);
	}
};