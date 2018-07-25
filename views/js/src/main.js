function main()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var socket = io();
	var game;
	var form = new Form(socket);

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	game = new Game(canvas, socket);
	game.render();
	window.addEventListener("resize", function()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}

exportLib(main);