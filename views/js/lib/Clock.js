var Clock = function()
{
	var start = new Date();

	this.restart = function()
	{
		start = new Date();
	}
	this.getElapsedTime = function(asMillis = false)
	{
		var now = new Date();
		var millis = now.getMilliseconds() - start.getMilliseconds();
		var start_sec = start.getSeconds() + start.getMinutes() * 60 + start.getHours() * 60 * 60;
		var now_sec = now.getSeconds() + now.getMinutes() * 60 + now.getHours() * 60 * 60;
		var sec = now_sec - start_sec;

		if (asMillis)
			return (sec + (millis / 1000));
		return ((sec * 1000 + millis) / 1000);
	}
}