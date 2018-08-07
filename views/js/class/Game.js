var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var chat = new Chat();
	var hand = new Hand(canvas);
	var rect = {};
	var button;

	rect.width = hand.getCardSize().x * 4;
	rect.height = hand.getCardSize().y;
	button = new Button(rect.width / 4, rect.height / 4);
	button.text = SYS.Button.PASS_TEXT;
	
	var sendPlayedCards = function(event)
	{
		var output = {
			cards: hand.getSelected()
		};
		
		socket.emit("Game:send_cards", output);
	}
	var drawRect = function()
	{
		rect.x = (canvas.width - rect.width) / 2;
		rect.y = (canvas.height - rect.height) / 3;
		context.strokeStyle = SYS.Rect.BORDER_COLOR;
		context.lineWidth = SYS.Rect.BORDER_WIDTH;
		context.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}
	var drawButton = function()
	{
		button.position.x = rect.x + (rect.width - button.size.x) / 2;
		button.position.y = rect.y + rect.height + SYS.PADDING;
		button.text = SYS.Button.PASS_TEXT;
		if (hand.getSelected().length > 0)
			button.text = SYS.Button.VALID_TEXT;
		button.draw(context);
	}
	
	this.render = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawRect();
		drawButton();
		hand.render(context, rect);
		window.requestAnimationFrame(self.render);
	}
	this.getChat = function()
	{
		return (chat);
	}
	this.getHand = function()
	{
		return (hand);
	}
	this.setHand = function(cards)
	{
		if (!Array.isArray(cards))
			return;
		hand.cards = cards;
	}
	button.onMouseClick(sendPlayedCards);
}