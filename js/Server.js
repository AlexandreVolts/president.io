let http = require("http");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let SocketManager = require("./class/SocketManager.js")
let Game = require("./class/Game.js");

var Server = function(port)
{
	const DIR = "/../views/";
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
			res.sendFile(path.resolve(__dirname + DIR + "index.html"));
		});
		app.get("/room/:name", manageUserInRoom);
		app.post("/create", manageRoomCreation);
		app.use(function(req, res, next)
		{
			res.setHeader("Content-Type", "text/plain");
			res.status(404).send("Erreur 404: Impossible de trouver cette page.");
		});
	}
	var manageRoomCreation = function(req, res)
	{
		if (game.addRoom(req.body)) {
			res.redirect("/room/" + req.body.name);
		}
		else
			res.redirect("/");
	}
	var manageUserInRoom = function(req, res)
	{
		let room = game.getRoom(req.params.name);
		
		if (room != undefined)
			res.sendFile(path.resolve(__dirname + DIR + "game.html"));
		else
			res.redirect("/");
	}
}

module.exports = Server;