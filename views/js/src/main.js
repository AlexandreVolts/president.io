function main()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var socket = io();
	var game;

	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
	game = new Game(canvas, socket);
	game.render();
	window.addEventListener("resize", function()
	{
		canvas.width = window.innerWidth * 0.8;
		canvas.height = window.innerHeight;
	});
}

window.onload = function()
{
	exportLib(main);
}