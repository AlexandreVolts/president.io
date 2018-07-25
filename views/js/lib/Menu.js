var Menu = function(width, height)
{
	Drawable.call(this, width, height);
	var self = this;
	var buttons = [];
	var delay = 0;
	var clock = new Clock();
	var current = 0;
	var last = current;
	var onChangeSound = undefined;

	this.selectorFillColor = "transparent";
	this.selectorStrokeColor = "transparent";
	this.selectorStrokeWidth = 0;
	this.selectorTextColor = "white";

	var drawSelector = function(ctx)
	{
		var selectorPosition = new Vector2D(self.position.x, self.position.y);
		var selectorHeight = self.size.y / buttons.length;
		var distance = current * selectorHeight - last * selectorHeight;
		var time = clock.getElapsedTime();
		var ratio = time >= delay ? 1 : (time / delay);

		selectorPosition.y += distance * ratio + last * selectorHeight;
		ctx.strokeStyle = self.selectorStrokeColor;
		ctx.fillStyle = self.selectorFillColor;
		ctx.lineWidth = self.selectorStrokeWidth;
		ctx.strokeRect(selectorPosition.x, selectorPosition.y, self.size.x, selectorHeight);
		ctx.fillRect(selectorPosition.x, selectorPosition.y, self.size.x, selectorHeight);
	}
	var drawButtons = function(ctx)
	{
		var pos = new Vector2D(0, 0);
		var textSize;
		var selectorHeight = self.size.y / buttons.length;

		for (var i = 0; i < buttons.length; i++) {
			textSize = Drawable.getTextSize(buttons[i], self.font);
			pos.x = self.position.x + ((self.size.x - textSize.width) / 2);
			pos.y = self.position.y + selectorHeight * (i + 1) - (selectorHeight - textSize.height) / 2;
			ctx.fillStyle = (i != current) ? self.textColor : self.selectorTextColor;
			ctx.fillText(buttons[i], pos.x, pos.y);
		}
	}

	this.change = function(dir = 0)
	{
		if (typeof dir !== "number" || clock.getElapsedTime() < delay)
			return;
		last = current;
		current += dir;
		if (current < 0)
			current = buttons.length - 1;
		if (current >= buttons.length)
			current = 0;
		if (onChangeSound != undefined)
			onChangeSound.play();
		clock.restart();
	}
	this.draw = function(ctx)
	{
		self.prepare(ctx);
		drawSelector(ctx);
		drawButtons(ctx);
	}
	this.getCurrent = function()
	{
		return (current);
	}
	this.setDelay = function(del)
	{
		if (delay >= 0)
			delay = del;
		else
			delay = 0;
	}
	this.setButtons = function(btns)
	{
		if (Array.isArray(btns))
			buttons = btns;
	}
	this.setChangeSound = function(path)
	{
		if (typeof path !== "string")
			return;
		onChangeSound = new Sound(path);
	}
}