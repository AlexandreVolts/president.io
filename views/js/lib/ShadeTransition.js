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
	var transitionDelay = 1.5;
	var balanceDelay = 0.5;
	var clock = new Clock();
	var isOnFirstFrame = true;
	var event = {};

	this.position = new Vector2D(0, 0);
	this.size = new Vector2D(width, height);

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
		if (state == event.state && isOnFirstFrame) {
			event.callback();
			isOnFirstFrame = false;
		}
		return (opacity);
	}

	this.restart = function()
	{
		state = ShadeTransitionState.READY;
		isOnFirstFrame = true;
		clock.restart();
	}
	this.draw = function(ctx)
	{
		var opacity;
		
		if (state == ShadeTransitionState.ENDED) {
			self.restart();
			return;
		}
		opacity = update() * 0.5;
		ctx.fillStyle = "rgba(255, 100, 100, " + opacity + ")";
		ctx.fillRect(self.position.x, self.position.y, self.size.x, self.size.y);
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
	this.setEventOnState = function(eventState, eventCallback)
	{
		event = {
			state: eventState,
			callback: eventCallback
		};
	}
}