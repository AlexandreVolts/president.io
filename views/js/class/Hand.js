const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;
const CLICK_DELAY = 0.2;

var Hand = function(canvas)
{
	var self = this;
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	var cardSize = cardsTileset.getTileSize();
	var mousePosition = new Vector2D(0, 0);
	var mouseClicked = false;
	var selected = [];
	var delay = new Clock();
	
	this.cards = [];

	cardSize.x *= 12.5;
	cardSize.y *= 20;
	cardsTileset.setTileSize(cardSize);

	var manageMouseClick = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
		mouseClicked = event.type == "mousedown";
	}
	var manageMouseMove = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
	}
	var checkMousePosition = function(pos)
	{
		if (mousePosition.x >= pos.x && mousePosition.y >= pos.y
			&& mousePosition.x <= pos.x + cardSize.x 
			&& mousePosition.y <= pos.y + cardSize.y)
			return (true);
		return (false);
	}
	var pushCards = function(adder, substractor, index, additionalConditions = true)
	{
		var time = delay.getElapsedTime();
		var card;
		var i = 0;

		if (mouseClicked && time > CLICK_DELAY && additionalConditions) {
			card = substractor.splice(index, 1)[0];
			for (; i < adder.length && card.strength > adder[i].strength; i++);
			adder.splice(i, 0, card);
			delay.restart();
			return (true);
		}
		return (false);
	}
	var drawHandCards = function(ctx)
	{
		var position = new Vector2D(0, 0);
		var rightPadding = (canvas.width - cardSize.x / 2);
		var next;
		
		for (var i = 0; i < self.cards.length; i++) {
			position.x = SYS.PADDING + (rightPadding / self.cards.length) * i;
			position.y = canvas.height - SYS.PADDING - cardSize.y;
			next = new Vector2D(position.x, position.y);
			next.x += rightPadding / self.cards.length;
			if (checkMousePosition(position) && !checkMousePosition(next)) {
				position.y -= SYS.PADDING;
				if (pushCards(selected, self.cards, i, (selected.length < 4)))
					continue;
			}
			cardsTileset.position = position;
			cardsTileset.draw(ctx, self.cards[i].value, self.cards[i].color.id);
		}
	}
	var drawSelectedCards = function(ctx, rect)
	{
		var position = new Vector2D(0, 0);
		var time = delay.getElapsedTime();

		for (var i = 0; i < selected.length; i++) {
			position.x = rect.x + (rect.width / 4) * i;
			position.y = rect.y + SYS.PADDING / 2;
			if (checkMousePosition(position)) {
				position.y -= SYS.PADDING / 2;
				if (pushCards(self.cards, selected, i))
					continue;
			}
			cardsTileset.position = position;
			cardsTileset.draw(ctx, selected[i].value, selected[i].color.id);
		}
	}
	
	this.render = function(ctx, rect)
	{
		drawHandCards(ctx);
		drawSelectedCards(ctx, rect);
	}
	this.getCardSize = function()
	{
		return (cardSize);
	}
	this.getSelected = function()
	{
		return (selected);
	}
	window.addEventListener("mousedown", manageMouseClick);
	window.addEventListener("mouseup", manageMouseClick);
	window.addEventListener("mousemove", manageMouseMove);
}