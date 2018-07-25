var Popup = function(width, height)
{
	Drawable.call(this, width, height);
	var self = this;
	var writingSpeed = 0;
	var clock = new Clock();
	var text = "";
	var currentText = "";
	var currentChar = 0;

	this.padding = new Vector2D(0, 0);

	var update = function()
	{
		var time = clock.getElapsedTime();

		if (time > writingSpeed && currentChar < text.length) {
			currentChar++;
			currentText = text.substr(0, currentChar);
			clock.restart();
		}
	}
	this.draw = function(ctx)
	{
		var pos = new Vector2D(self.position.x, self.position.y);
		var textSize = Drawable.getTextSize(text, self.font);
		
		self.prepare(ctx);
		update();
		pos.x += self.padding.x;
		pos.y += textSize.height + self.padding.y;
		ctx.fillStyle = self.textColor;
		ctx.fillText(currentText, pos.x, pos.y);
	}
	this.isWriteEnded = function()
	{
		return (currentText.length == text.length);
	}
	this.getText = function()
	{
		return (text);
	}
	this.setText = function(newtext)
	{
		if (typeof newtext != "string")
			return;
		text = newtext;
		currentText = "";
		currentChar = 0;
	}
	this.setWritingSpeed = function(newspeed)
	{
		if (typeof newspeed != "number")
			return;
		writingSpeed = newspeed;
	}
}