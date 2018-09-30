const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;

var Hand = function(canvas, soundPlayer)
{
	var self = this;
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	var cardSize = cardsTileset.getTileSize();
	var mousePosition = new Vector2D(0, 0);
	var mouseClicked = false;
	var delay = new Clock();
	var animatedCard;
	var rightPadding;
	var middle;
	var shade;
	
	this.revolution = false;
	this.isPlayerTurn = false;
	this.cards = [];

	cardSize.x *= 12.5;
	cardSize.y *= 20;
	middle = new Middle(canvas, cardSize);
	shade = new ShadeTransition(cardSize.x, cardSize.y);
	cardsTileset.setTileSize(cardSize);

	var computePosition = function(index, rect = undefined)
	{
		var output = new Vector2D(0, 0);
		
		if (rect == undefined) {
			output.x = SYS.PADDING + (rightPadding / self.cards.length) * index;
			output.y = canvas.height - SYS.PADDING - cardSize.y;
		}
		else {
			output.x = rect.x + (rect.width / 4) * index + SYS.PADDING;
			output.y = rect.y + SYS.PADDING;
		}
		return (output);
	}
	var manageMouseClick = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
		mouseClicked = event.type === "mousedown";
	}
	var manageMouseMove = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
	}
	var manageTouch = function(event)
	{
		mousePosition.x = event.changedTouches[0].pageX;
		mousePosition.y = event.changedTouches[0].pageY;
		mouseClicked = event.type === "touchstart";
	}
	var onClickOnCard = function(position)
	{
		animatedCard.origin = position;
		soundPlayer.rand(SYS.Fx.PATH, SYS.Fx.CARDS_SOUNDS);
		delay.restart();
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
		var i = 0;

		if (time > SYS.CLICK_DELAY && additionalConditions) {
			animatedCard = substractor.splice(index, 1)[0];
			for (; i < adder.length && animatedCard.strength > adder[i].strength; i++);
			adder.splice(i, 0, animatedCard);
			mouseClicked = false;
			return (true);
		}
		return (false);
	}
	var drawAnimatedCard = function(ctx, rect)
	{
		var ratio = delay.getElapsedTime() / SYS.CLICK_DELAY;
		var distance = new Vector2D(0, 0);
		var index = CardUtils.indexOf(self.cards, animatedCard);
		var finalPosition;

		if (ratio >= 1) {
			animatedCard = undefined;
			return;
		}
		if (index != -1)
			finalPosition = computePosition(index);
		else {
			index = CardUtils.indexOf(middle.selected, animatedCard);
			finalPosition = computePosition(index, rect);
		}
		distance.x = finalPosition.x - animatedCard.origin.x;
		distance.y = finalPosition.y - animatedCard.origin.y;
		cardsTileset.position.x = animatedCard.origin.x + distance.x * ratio;
		cardsTileset.position.y = animatedCard.origin.y + distance.y * ratio;
		cardsTileset.draw(ctx, animatedCard.value, animatedCard.color);
	}
	var drawHelper = function(ctx, strength)
	{
		var currentCards = middle.getCurrentCards();
		var cardId = 0;
		
		if (currentCards.length == 0) {
			shade.draw(ctx);
			return;
		}
		if (self.revolution && currentCards.length > 1)
			cardId = currentCards.length - 2;
		if ((!self.revolution && currentCards[cardId].strength < strength)
			|| (self.revolution && currentCards[cardId].strength > strength)
			|| currentCards[cardId].strength == 13)
			shade.draw(ctx);
	}
	var drawHandCards = function(ctx)
	{
		var position;
		var next;
		var additionalCondition;
		
		for (var i = 0; i < self.cards.length; i++) {
			position = computePosition(i);
			shade.position = position;
			next = computePosition(i + 1)
			if (checkMousePosition(position) && !checkMousePosition(next)) {
				position.y -= SYS.PADDING;
				additionalCondition = (middle.selected.length < 4 && mouseClicked);
				if (pushCards(middle.selected, self.cards, i, additionalCondition)) {
					onClickOnCard(position);
					continue;
				}
			}
			if (CardUtils.equals(self.cards, animatedCard))
				continue;
			cardsTileset.position = position;
			cardsTileset.draw(ctx, self.cards[i].value, self.cards[i].color);
			if (self.isPlayerTurn)
				drawHelper(ctx, self.cards[i].strength);
		}
	}
	var drawCardsOnMiddle = function(array, ctx, rect, isSelectedArray = false)
	{
		var position;
		var time = delay.getElapsedTime();

		if (!middle.allowDraw())
			return;
		for (var i = 0; i < array.length; i++) {
			position = computePosition(i, rect);
			if (checkMousePosition(position)) {
				position.y -= SYS.PADDING / 2;
				if (isSelectedArray && pushCards(self.cards, middle.selected, i, mouseClicked)) {
					onClickOnCard(position);
					continue;
				}
			}
			if (CardUtils.equals(array[i], animatedCard))
				continue;
			cardsTileset.position = position;
			cardsTileset.draw(ctx, array[i].value, array[i].color);
		}
	}
	
	this.clearSelected = function()
	{
		for (var i = 0, len = middle.selected.length; i < len; i++)
			pushCards(self.cards, middle.selected, 0);
	}
	this.render = function(ctx)
	{
		var rect = middle.getRect();
		
		rightPadding = (canvas.width - cardSize.x / 2);
		middle.render(ctx, cardsTileset);
		drawHandCards(ctx);
		drawCardsOnMiddle(middle.getCurrentCards(), ctx, rect);
		drawCardsOnMiddle(middle.selected, ctx, rect, true);
		if (animatedCard)
			drawAnimatedCard(ctx, rect);
	}
	this.getCardSize = function()
	{
		return (cardSize);
	}
	this.getMiddle = function()
	{
		return (middle);
	}
	this.getSelected = function()
	{
		return (middle.selected);
	}
	window.addEventListener("touchstart", manageTouch);
	window.addEventListener("touchend", manageTouch);
	window.addEventListener("mousedown", manageMouseClick);
	window.addEventListener("mouseup", manageMouseClick);
	window.addEventListener("mousemove", manageMouseMove);
}