var Middle = function(canvas, cardSize)
{
	var self = this;
	var rect = {
		width: cardSize.x * 4 + SYS.PADDING * 8,
		height: cardSize.y + SYS.PADDING * 2
	};
	var discardClock = new Clock();
	var newCardsClock = new Clock();
	var discarding = [];
	var last;
	var discardPosX;
	var oldCurrentCards;

	this.selected = [];
	this.currentCards = [];

	var drawRectangle = function(ctx)
	{
		rect.x = (canvas.width - rect.width) / 2;
		rect.y = (canvas.height - rect.height) / 4;
		discardPosX = rect.x + rect.width + SYS.PADDING;
		ctx.strokeStyle = SYS.Rect.BORDER_COLOR;
		ctx.lineWidth = SYS.Rect.BORDER_WIDTH;
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}
	var drawDiscarding = function(ctx, tileset)
	{
		var posX = 0;
		var distanceX;
		var time = discardClock.getElapsedTime() / SYS.DISCARD_ANIMATION_DELAY;
		
		tileset.position.x = discardPosX;
		tileset.position.y = rect.y;
		if (time >= 1)
			last = discarding[discarding.length - 1];
		if (last != undefined)
			tileset.draw(ctx, last.value, last.color);
		for (var i = 0, len = discarding.length; i < len && time <= 1; i++) {
			distanceX = discardPosX - discarding[i].originX;
			posX = discarding[i].originX + distanceX * time;
			tileset.position.x = posX;
			tileset.draw(ctx, discarding[i].value, discarding[i].color);
		}
	}
	var drawCurrentCards = function(ctx, tileset)
	{
		var time = newCardsClock.getElapsedTime() / SYS.DISCARD_ANIMATION_DELAY;
		var posY = (-cardSize.y) + (rect.y + cardSize.y) * (time * time);
		var curPosY;

		if (time >= 1)
			return;
		for (var i = 0, len = self.currentCards.length; i < len; i++) {
			tileset.position.x = rect.x + (rect.width / 4) * i + SYS.PADDING;
			if (i < oldCurrentCards.length) {
				tileset.position.y = rect.y + SYS.PADDING;
				tileset.draw(ctx, oldCurrentCards[i].value, oldCurrentCards[i].color);
			}
			tileset.position.y = posY;
			tileset.draw(ctx, self.currentCards[i].value, self.currentCards[i].color);
		}
	}
	
	this.allowDraw = function()
	{
		var time = newCardsClock.getElapsedTime() / SYS.DISCARD_ANIMATION_DELAY;
		
		return (time >= 1)
	}
	this.clear = function()
	{
		if (self.currentCards.length == 0)
			return;
		discardClock.restart();
		discarding = self.currentCards;
		self.currentCards = [];
		for (var i = 0, len = discarding.length; i < len; i++)
			discarding[i].originX = rect.x + (i * (cardSize.x + 1));
	}
	this.render = function(ctx, tileset)
	{
		drawRectangle(ctx);
		if (discarding.length > 0)
			drawDiscarding(ctx, tileset);
		drawCurrentCards(ctx, tileset);
	}
	this.getRect = function()
	{
		return (rect);
	}
	this.getCurrentCards = function()
	{
		return (self.currentCards);
	}
	this.setCurrentCards = function(newCards)
	{
		if (!Array.isArray(newCards))
			return;
		oldCurrentCards = self.currentCards;
		self.currentCards = newCards;
		newCardsClock.restart();
	}
}