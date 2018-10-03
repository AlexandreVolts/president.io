var Timer = function()
{
	var clock = new Clock();

	this.draw = function(ctx, width)
	{
		var time = ~~(clock.getElapsedTime());
		var text = (30 - time) + " s";
		var position = new Vector2D(0, SYS.PADDING * 4);

		ctx.font = "50px York White Letter";
		ctx.fillStyle = "white";
		position.x = width - ctx.measureText(text).width - SYS.PADDING;
		ctx.fillText(text, position.x, position.y);
	}
}