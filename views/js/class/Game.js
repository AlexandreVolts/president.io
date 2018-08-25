var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager;
	var soundPlayer = new MusicPlayer();
	var hand = new Hand(canvas, soundPlayer);
	var button = document.createElement("button");
	var hidden = document.getElementById("hiddenMiddleButton");

	this.timer = undefined;

	button.textContent = SYS.Button.PASS_TEXT;
	button.id = "middleButton";
	document.getElementById("chat").appendChild(button);
	socketManager = new SocketManager(socket, self);
	
	var sendPlayedCards = function()
	{
		var output = {
			cards: hand.getSelected()
		};
		
		socket.emit("Game:send_cards", output);
	}
	var drawButton = function()
	{
		var rect = hand.getMiddle().getRect();
		
		button.style.left = (rect.x + (rect.width - button.offsetWidth) / 2) + "px";
		button.style.top = (rect.y + rect.height) + "px";
		hidden.style.left = button.style.left;
		hidden.style.top = button.style.top;
		button.textContent = SYS.Button.PASS_TEXT;
		if (hand.getSelected().length > 0)
			button.textContent = SYS.Button.VALID_TEXT;
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
	hidden.addEventListener("click", sendPlayedCards);
}