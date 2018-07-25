var Drawable = function(width, height)
{
	var self = this;
	this.size = new Vector2D(width, height);
	this.position = new Vector2D(0, 0);
	this.fillColor = "black";
	this.strokeColor = "black";
	this.strokeWidth = 0;
	this.textColor = "white";
	this.font = "18px Arial";

	this.prepare = function(ctx)
	{
		ctx.strokeStyle = self.strokeColor;
		ctx.fillStyle = self.fillColor;
		ctx.lineWidth = self.strokeWidth;
		ctx.font = self.font;
		ctx.strokeRect(self.position.x, self.position.y, self.size.x, self.size.y);
		ctx.fillRect(self.position.x, self.position.y, self.size.x, self.size.y);
	}
}

Drawable.getTextSize = function(text, font)
{
	var element = document.createElement("div");
	var output = {width: 0, height: 0};

	element.textContent = text;
	element.setAttribute("style", font + "; position: absolute;top:0;left:0;");
	document.body.appendChild(element);
	output.width = element.offsetWidth;
	output.height = element.offsetHeight;
	document.body.removeChild(element);

	return (output);
}