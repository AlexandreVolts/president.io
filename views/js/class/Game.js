var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	
	this.render = function()
	{
		window.requestAnimationFrame(self.render);
	}
}