var ShadeTransitionState = Object.freeze({
	"READY":0,
	"UP":1,
	"BALANCE":2,
	"DOWN":3,
	"ENDED":4
});
var ShadeTransition = function(width, height)
{
	var self = this;
	var state = ShadeTransitionState.ENDED;
	var transitionDelay = 0.5;
	var balanceDelay = 0.5;
	var clock = new Clock();

	this.width = width;
	this.height = height;

	var update = function()
	{
		var time = clock.getElapsedTime();
		var opacity = 0;
		
		if (time < transitionDelay) {
			opacity = time / transitionDelay;
			state = ShadeTransitionState.UP;
		}
		else if (time < transitionDelay + balanceDelay) {
			opacity = 1;
			state = ShadeTransitionState.BALANCE;
		}
		else if (time < transitionDelay * 2 + balanceDelay) {
			opacity = 1 - ((time - transitionDelay - balanceDelay) / transitionDelay);
			state = ShadeTransitionState.DOWN;
		}
		else
			state = ShadeTransitionState.ENDED;
		return (opacity);
	}

	this.restart = function()
	{
		state = ShadeTransitionState.READY;
		clock.restart();
	}
	this.draw = function(ctx)
	{
		var opacity;
		
		if (state == ShadeTransitionState.ENDED)
			return;
		opacity = update();
		ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
		ctx.fillRect(0, 0, self.width, self.height);
	}
	this.getState = function()
	{
		return (state);
	}
	this.setTransitionDelay = function(newdelay)
	{
		if (typeof newdelay != "number")
			return;
		transitionDelay = newdelay;
	}
	this.setBalanceDelay = function(newdelay)
	{
		if (typeof newdelay != "number")
			return;
		balanceDelay = newdelay;
	}
}