const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const SocketManager = require("./class/SocketManager.js")
const Game = require("./class/Game.js");

var Server = function(port)
{
	const DIR = __dirname + "/../views/";
	let app = express();
	let game = new Game();
	let server = app.listen(port, function()
	{
		console.log("Server listen on port: " + port + ".");
		start();
	});
	let socketManager = new SocketManager(server, game);

	var start = function() {
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(express.static("views"));
		app.get("/", function(req, res)
		{
			res.sendFile(path.resolve(DIR + "index.html"));
		});
		app.get("/room/:name", manageUserInRoom);
		app.post("/create", manageRoomCreation);
		app.post("/join", manageUserJoin);
		app.post("/random", sendUserInRandomRoom);
		app.use(function(req, res, next)
		{
			res.setHeader("Content-Type", "text/plain");
			res.status(404).send("Erreur 404: Impossible de trouver cette page.");
		});
	}
	var manageRoomCreation = function(req, res)
	{
		game.addRoom(req.body);
		res.redirect("/room/" + req.body.name);
	}
	var manageUserInRoom = function(req, res)
	{
		let room = game.getRoom(req.params.name);
		
		if (room != undefined)
			res.sendFile(path.resolve(DIR + "game.html"));
		else
			res.redirect("/");
	}
	var manageUserJoin = function(req, res)
	{
		res.redirect("/room/" + req.body.name);
	}
	var sendUserInRandomRoom = function(req, res)
	{
		let roomName = game.getRandomPublicRoom();
		
		if (roomName != undefined)
			res.redirect("/room/" + roomName);
		else
			res.sendFile(path.resolve(DIR + "random.html"));
	}
}
module.exports = Server;