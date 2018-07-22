let http = require("http");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let socketio = require("socket.io");
let Game = require("./class/Game.js");

var Server = function(port)
{
	const DIR = "/../views/";
	let app = express();
	let io;
	let game = new Game();
	let server = app.listen(port, function()
	{
		console.log("Server listen on port: " + port + ".");
		start();
	});
	let rooms = [];

	var start = function() {
		app.use(bodyParser.urlencoded({extended: true}));
		app.get("/", function(req, res)
		{
			res.sendFile(path.resolve(__dirname + DIR + "index.html"));
		});
		app.get("/room/:name", function(req, res)
		{
			console.log(req.params.name);
		});
		app.post("/create", manageRoomCreation);
		app.use(function(req, res, next)
		{
			res.setHeader("Content-Type", "text/plain");
			res.status(404).send("Erreur 404: Impossible de trouver cette page.");
		});
		
		io = socketio(server);
		io.on("connection", function(socket)
		{
			console.log("New user is connected. (id: " + socket.id + ")");
			socket.on("disconnect", function()
			{
				onDisconnect(socket);
			});
		});
	}
	var manageRoomCreation = function(req, res)
	{
		if (game.addRoom(req.body)) {

		}
	}
	var onDisconnect = function(socket)
	{
		console.log("User " + socket.id + " has disconnected.");
	}
}

module.exports = Server;