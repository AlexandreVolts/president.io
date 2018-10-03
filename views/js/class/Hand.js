const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;

let Hand = function(canvas, soundPlayer)
{
	let self = this;
	let cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	let cardSize = cardsTileset.getTileSize();
	let mousePosition = new Vector2D(0, 0);
	let mouseClicked = false;
	let delay = new Clock();
	let animatedCard;
	let rightPadding;
	let middle;
	let shade;
	
	this.revolution = false;
	this.isPlayerTurn = false;
	this.cards = [];

	cardSize.x *= 12.5;
	cardSize.y *= 20;
	middle = new Middle(canvas, cardSize);
	shade = new ShadeTransition(cardSize.x, cardSize.y);
	cardsTileset.setTileSize(cardSize);

	let computePosition = function(index, rect = undefined)
	{
		let output = new Vector2D(0, 0);
		
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
	let manageMouseClick = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
		mouseClicked = event.type === "mousedown";
	}
	let manageMouseMove = function(event)
	{
		mousePosition.x = event.clientX;
		mousePosition.y = event.clientY;
	}
	let manageTouch = function(event)
	{
		mousePosition.x = event.changedTouches[0].pageX;
		mousePosition.y = event.changedTouches[0].pageY;
		mouseClicked = event.type === "touchstart";
	}
	let onClickOnCard = function(position)
	{
		animatedCard.origin = position;
		soundPlayer.rand(SYS.Fx.PATH, SYS.Fx.CARDS_SOUNDS);
		delay.restart();
	}
	let checkMousePosition = function(pos)
	{
		if (mousePosition.x >= pos.x && mousePosition.y >= pos.y
			&& mousePosition.x <= pos.x + cardSize.x 
			&& mousePosition.y <= pos.y + cardSize.y)
			return (true);
		return (false);
	}
	let pushCards = function(adder, substractor, index, additionalConditions = true)
	{
		let time = delay.getElapsedTime();
		let i = 0;

		if (time > SYS.CLICK_DELAY && additionalConditions) {
			animatedCard = substractor.splice(index, 1)[0];
			for (let len = adder.length; i < len; i++) {
				if (animatedCard.strength < adder[i].strength && adder[i].strength != 13)
					break;
			}
			adder.splice(i, 0, animatedCard);
			mouseClicked = false;
			return (true);
		}
		return (false);
	}
	let drawAnimatedCard = function(ctx, rect)
	{
		let ratio = delay.getElapsedTime() / SYS.CLICK_DELAY;
		let distance = new Vector2D(0, 0);
		let index = CardUtils.indexOf(self.cards, animatedCard);
		let finalPosition;

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
	let drawHelper = function(ctx, strength)
	{
		let currentCards = middle.getCurrentCards();
		
		if (currentCards.length == 0) {
			shade.draw(ctx);
			return;
		}
		if ((!self.revolution && currentCards[0].strength < strength)
			|| (self.revolution && currentCards[0].strength > strength)
			|| strength == 13)
			shade.draw(ctx);
	}
	let drawHandCards = function(ctx)
	{
		let position;
		let next;
		let additionalCondition;
		
		for (let i = 0; i < self.cards.length; i++) {
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
	let drawCardsOnMiddle = function(array, ctx, rect, isSelectedArray = false)
	{
		let position;
		let time = delay.getElapsedTime();

		if (!middle.allowDraw())
			return;
		for (let i = 0; i < array.length; i++) {
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
		for (let i = 0, len = middle.selected.length; i < len; i++)
			pushCards(self.cards, middle.selected, 0);
	}
	this.render = function(ctx)
	{
		let rect = middle.getRect();
		
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