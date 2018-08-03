var Button = function(width, height)
{
	Drawable.call(this, width, height);
	var self = this;
	
	this.text = "";

	this.draw = function(ctx)
	{
		var pos = new Vector2D(0, 0);
		var textSize = Drawable.getTextSize(self.text, self.font);
		
		pos.x = self.position.x + ((self.size.x - textSize.width) / 2);
		pos.y = self.position.y + ((self.size.y - textSize.height) / 2);
		self.prepare(ctx);
		ctx.fillStyle = self.textColor;
		ctx.fillText(self.text, pos.x, pos.y);
	}
	this.onMouseClick = function(callback)
	{
		window.addEventListener("mousedown", function(event) {
			var point = new Vector2D(event.clientX, event.clientY);
			
			if (point.x >= self.position.x 
				&& point.y >= self.position.y
				&& point.x <= self.position.x + self.size.x 
				&& point.y <= self.position.y + self.size.y)
				callback(event);
		});
	}
}