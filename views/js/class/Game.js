var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var hand = new Hand(canvas);
	
	this.render = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		hand.render(context);
		window.requestAnimationFrame(self.render);
	}
	this.setHand = function(cards)
	{
		if (!Array.isArray(cards))
			return;
		hand.cards = cards;
	}
}