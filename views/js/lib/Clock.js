var Clock = function()
{
	 let start = performance.now();

	this.restart = function()
	{
		start = performance.now();
	}
	this.getElapsedTime = function(asMillis = false)
	{
		let now = performance.now();
		let millis = now - start;

		if (asMillis)
			return (millis);
		return (millis / 1000);
	}
}