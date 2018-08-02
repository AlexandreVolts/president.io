const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;
const CLICK_DELAY = 0.2;

var Hand = function(canvas)
{
	var self = this;
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	var cardSize = cardsTileset.getTileSize();
	var mousePosition = new Vector2D(0, 0);
	var mouseClicked = false;
	var rect = {};
	var selected = [];
	var delay = new Clock();
	
	this.cards = [];

	cardSize.x *= 12.5;
	cardSize.y *= 20;
	cardsTileset.setTileSize(cardSize);
	rect.width = cardSize.x * 4;
	rect.height = cardSize.y;

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

		if (mouseClicked && time > CLICK_DELAY && additionalConditions) {
			adder.push(substractor.splice(index, 1)[0]);
			delay.restart();
			return (true);
		}
		return (false);
	}
	var drawHandCards = function(ctx)
	{
		var position = new Vector2D(0, 0);
		var rightPadding = (canvas.width - cardSize.x / 2);
		
		for (var i = 0; i < self.cards.length; i++) {
			position.x = SYS.PADDING + (rightPadding / self.cards.length) * i;
			position.y = canvas.height - SYS.PADDING - cardSize.y;
			if (checkMousePosition(position)) {
				position.y -= SYS.PADDING;
				if (pushCards(selected, self.cards, i, (selected.length < 4)))
					continue;
			}
			cardsTileset.position = position;
			cardsTileset.draw(ctx, self.cards[i].value, self.cards[i].color.id);
		}
	}
	var drawSelectedCards = function(ctx)
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
	
	this.render = function(ctx)
	{
		rect.x = (canvas.width - rect.width) / 2;
		rect.y = (canvas.height - rect.height) / 2;
		ctx.strokeStyle = "lightgray";
		ctx.lineWidth = 5;
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		drawHandCards(ctx);
		drawSelectedCards(ctx);
	}
	this.getSelected = function()
	{
		return (selected);
	}
	window.addEventListener("mousedown", manageMouseClick);
	window.addEventListener("mouseup", manageMouseClick);
	window.addEventListener("mousemove", manageMouseMove);
}