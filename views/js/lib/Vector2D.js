var Vector2D = function(sx, sy)
{
	var self = this;
	this.x = sx;
	this.y = sy;

	this.equals = function(vector)
	{
		return (self.x == vector.x && self.y == vector.y);
	}
	this.add = function(vector)
	{
		self.x += vector.x;
		self.y += vector.y;
	}
	this.substract = function(vector)
	{
		self.x -= vector.x;
		self.y -= vector.y;
	}
}