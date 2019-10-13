module.exports = {
	validateTarget(target)
	{
		if (typeof target.name != 'string') {
			throw 'name of the target does not exist or is not a string';
		}
	}
}