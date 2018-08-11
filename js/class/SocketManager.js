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
		socket.on("Game:send_cards", function(datas)
		{
			getSendedCards(datas, socket);
		});
		socket.on("disconnect", function()
		{
			onDisconnect(socket);
		});
	});

	var getLoginInfos = function(datas, socket)
	{
		let password = datas.password.length > 1 ? datas.password : undefined;
		let room = game.getRoom(datas.roomName);
		let output = {valid: false};

		if (room == undefined)
			output.message = "Room doesn't exists.";
		else if (datas.pseudo.length < 2 || datas.pseudo.length > 15)
			output.message = "Invalid username length.";
		else if (password !== room.getPassword())
			output.message = "Invalid password.";
		else {
			output.valid = true;
			output.players = room.getFormattedPlayersInfos();
			socket.pseudo = datas.pseudo;
			socket.room = room.name;
			socket.score = 0;
		}
		socket.emit("Login:send_status", output);
		if (output.valid)
			room.addUser(socket);
	}
	var checkCards = function(hand, cards)
	{
		let output = true;
		
		if (!Array.isArray(cards))
			return (false);
		cards.forEach(function(card) {
			if (Card.indexOf(hand, card) == -1)
				output = false;
		});
		return (output);
	}
	var getSendedCards = function(datas, socket)
	{
		let room = game.getRoom(socket.room);

		if (room != undefined && checkCards(socket.hand, datas.cards))
			room.getRound().computeTurn(socket, datas.cards);
	}
	var onDisconnect = function(socket)
	{
		let name = (socket.pseudo || socket.id);
		let room = game.getRoom(socket.room);

		if (room != undefined)
			room.removeUser(socket);
	}
}
module.exports = SocketManager;