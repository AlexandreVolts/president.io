var Tileset = function(src, nbTilesX, nbTilesY)
{
	var self = this;
	var tileset = new Image();
	var tileSize = new Vector2D(0, 0);
	var nbTiles = new Vector2D(nbTilesX, nbTilesY);
	var size = new Vector2D(10, 10);

	this.position = new Vector2D(0, 0);

	tileset.src = src;
	tileset.addEventListener("load", function() {
		tileSize.x = tileset.width / nbTiles.x;
		tileSize.y = tileset.height / nbTiles.y;
	});

	this.draw = function(ctx, x, y)
	{
		ctx.drawImage(tileset,
		tileSize.x * x, tileSize.y * y,
		tileSize.x, tileSize.y,
		self.position.x, self.position.y,
		size.x, size.y);
	}
	this.setTileSize = function(newsize)
	{
		if (newsize.x == undefined || newsize.y == undefined)
			return;
		size = newsize;
	}
}