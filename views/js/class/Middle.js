var Middle = function(canvas, cardSize)
{
	var self = this;
	var rect = {
		width: cardSize.x * 4,
		height: cardSize.y
	};
	var clock = new Clock();
	var discarding;
	var last;

	this.selected = [];
	this.currentCards = [];

	var drawRectangle = function(ctx)
	{
		rect.x = (canvas.width - rect.width) / 2;
		rect.y = (canvas.height - rect.height) / 3;
		ctx.strokeStyle = SYS.Rect.BORDER_COLOR;
		ctx.lineWidth = SYS.Rect.BORDER_WIDTH;
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}
	
	this.clear = function()
	{
		clock.restart();
		discarding = self.currentCards;
		self.currentCards = [];
	}
	this.render = function(ctx)
	{
		drawRectangle(ctx);
	}
	this.getRect = function()
	{
		return (rect);
	}
}