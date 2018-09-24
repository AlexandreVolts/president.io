const socketio = require("socket.io");
const Card = require("./Card.js");

var SocketManager = function(server, game)
{
	let io;
	
	io = socketio(server);
	io.on("connection", function(socket)
	{
		socket.on("Login:send_infos", function(datas)
		{
			getLoginInfos(datas, socket);
		});
		socket.on("Chat:message", function(datas)
		{
			if (typeof datas.content == "string")
				broadcastMessage(datas, socket);
		});
		socket.on("Game:send_cards", function(datas)
		{
			getSentCards(datas, socket);
		});
		socket.on("disconnect", function()
		{
			onDisconnect(socket);
		});
	});

	let getLoginInfos = function(datas, socket)
	{
		let password = datas.password.length > 1 ? datas.password : undefined;
		let room = game.getRoom(datas.roomName);
		let output = {valid: false};

		if (room == undefined)
			output.message = "Room doesn't exists.";
		else if (room.isFilled())
			output.message = "Room is filled.";
		else if (datas.pseudo.length < 2 || datas.pseudo.length > 15)
			output.message = "Invalid username length.";
		else if (password !== room.getPassword())
			output.message = "Invalid password.";
		else {
			output.valid = true;
			output.players = room.getFormattedPlayersInfos();
			socket.pseudo = datas.pseudo.split("<").join("&lt");
			socket.room = room.name;
			socket.score = 0;
			socket.place = -1;
		}
		socket.emit("Login:send_status", output);
		if (output.valid)
			room.addUser(socket);
	}
	let broadcastMessage = function(datas, socket)
	{
		let room = game.getRoom(socket.room);
		let output = {
			pseudo: socket.pseudo,
			content: datas.content
		};

		if (room == undefined)
			return;
		room.broadcast("Chat:message", output);
	}
	let checkCards = function(hand, cards)
	{
		let output = true;
		
		if (!Array.isArray(cards) || cards.length > 4)
			return (false);
		cards.forEach(function(card) {
			if (Card.indexOf(hand, card) == -1)
				output = false;
		});
		return (output);
	}
	let getSentCards = function(datas, socket)
	{
		let room = game.getRoom(socket.room);
		let round;

		if (room != undefined && checkCards(socket.hand, datas.cards)) {
			round = room.getRound();
			if (round != undefined) {
				round.analyse(socket, datas.cards);
				if (round.isEnded())
					room.startRound();
			}
		}
	}
	let onDisconnect = function(socket)
	{
		let name = (socket.pseudo || socket.id);
		let room = game.getRoom(socket.room);

		if (room != undefined) {
			room.removeUser(socket);
			if (room.getFormattedPlayersInfos().length == 0) {
				console.log("Room " + room.name + " has been destroyed.");
				game.removeRoom(room.name);
			}
		}
	}
}
module.exports = SocketManager;