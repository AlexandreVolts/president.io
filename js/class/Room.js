const Round = require("./Round.js");

var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let players = [];
	let waiters = [];
	let currentRound = 0;
	let gameStarted = false;
	let round;
	
	this.name = name;

	/*
		TODO: 	- Compute and send score
				- Count rounds
				- Maybe a little pause between each round ?
				- Card redistribution at end of a game
	*/
	this.startRound = function()
	{
		currentRound++;
		round = new Round(self, players);
		gameStarted = true;
		players.forEach(function(socket)
		{
			socket.place = -1;
		});
	}
	
	this.broadcast = function(event, datas)
	{
		players.forEach(function(socket)
		{
			socket.emit(event, datas);
		});
	}
	this.addUser = function(socket)
	{
		let output = {
			index: players.length,
			pseudo: socket.pseudo,
			event: "join"
		};
		
		if (!gameStarted) {
			players.push(socket);
			if (players.length >= 4)
				self.startRound();
		}
		else
			waiters.push(socket);
		output.playersNumber = players.length;
		self.broadcast("Room:join", output);
		console.log("User " + socket.pseudo + " has join the room " + self.name + ".");
	}
	this.removeUser = function(socket)
	{
		let currentPlayer;
		let output = {
			index: players.indexOf(socket),
			pseudo: socket.pseudo,
			event: "leave"
		};

		if (gameStarted) {
			currentPlayer = round.getCurrentPlayer();
			if (players[currentPlayer].id === socket.id && currentPlayer == players.length - 1)
				round.setCurrentPlayer(0);
		}
		players.splice(output.index, 1);
		output.playersNumber = players.length;
		self.broadcast("Room:leave", output);
		console.log("User " + socket.pseudo + " leaved the room " + self.name + ".");
	}
	this.getPassword = function()
	{
		return (PASSWORD);
	}
	this.getRound = function()
	{
		return (round);
	}
}
module.exports = Room;