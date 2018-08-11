function main()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var socket = io();
	var game;
	var form;

	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
	game = new Game(canvas, socket);
	form = new Form(socket, game.getChat());
	game.render();
	window.addEventListener("resize", function()
	{
		canvas.width = window.innerWidth * 0.8;
		canvas.height = window.innerHeight;
	});
}

exportLib(main);