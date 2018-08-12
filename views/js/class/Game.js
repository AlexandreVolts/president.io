var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var chat = new Chat();
	var hand = new Hand(canvas);
	var button;

	this.timer = undefined;

	button = new Button(200, 75);
	button.text = SYS.Button.PASS_TEXT;
	
	var sendPlayedCards = function(event)
	{
		var output = {
			cards: hand.getSelected()
		};
		
		socket.emit("Game:send_cards", output);
	}
	var drawButton = function()
	{
		var rect = hand.getMiddle().getRect();
		
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
		drawButton();
		if (self.timer != undefined)
			self.timer.draw(context, canvas.width);
		hand.render(context);
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