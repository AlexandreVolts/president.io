var Game = function(canvas, socket)
{
	const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	var tileSize = cardsTileset.getTileSize();
	
	this.hand = [];
	tileSize.x *= 12.5;
	tileSize.y *= 20;
	cardsTileset.setTileSize(tileSize);
	
	var renderHand = function()
	{
		var position = new Vector2D(0, 0);
		
		position.y = canvas.height - SYS.PADDING - tileSize.y;
		for (var i = 0, len = self.hand.length; i < len; i++) {
			position.x = SYS.PADDING + (canvas.width / len) * i;
			cardsTileset.position = position;
			cardsTileset.draw(context, self.hand[i].value, self.hand[i].color.id);
		}
	}
	this.render = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		renderHand();
		window.requestAnimationFrame(self.render);
	}
}