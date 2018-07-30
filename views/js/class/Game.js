var Game = function(canvas, socket)
{
	const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	var tileSize = cardsTileset.getTileSize();
	
	this.hand = [];
	tileSize.x *= 25;
	tileSize.y *= 40;
	cardsTileset.setTileSize(tileSize);
	
	var renderHand = function()
	{
		cardsTileset.draw(context, 1, 1);
		for (var i = 0, l = self.hand.length; i < l; i++) {
			cardsTileset.position.x = i * tileSize.x;
			cardsTileset.draw(context, self.hand[i].value, 0);
		}
	}
	this.render = function()
	{
		renderHand();
		window.requestAnimationFrame(self.render);
	}
}