var Game = function(canvas, socket)
{
	const CARDS_PATH = SYS.IMG_PATH + SYS.CARDS_TILESET_NAME;
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var cardsTileset = new Tileset(CARDS_PATH, SYS.CARDS_COL_NBR, SYS.CARDS_ROW_NBR);
	
	var renderHand = function()
	{
		cardsTileset.setTileSize(new Vector2D(200, 300));
		cardsTileset.draw(context, 1, 1);
	}
	this.render = function()
	{
		renderHand();
		window.requestAnimationFrame(self.render);
	}
}