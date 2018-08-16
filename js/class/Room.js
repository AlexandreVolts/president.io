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
		TODO: 	- Count rounds
				- Maybe a little pause between each round ?
				- Card redistribution between rounds
				- Add an helper (colorize playable cards)
	*/
	var appendWaiters = function()
	{
		players = players.concat(waiters);
		waiters = [];
	}
	
	this.startRound = function()
	{
		appendWaiters();
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
		let output = datas;

		for(let i = 0, len = players.length; i < len; i++) {
			output.index = i;
			players[i].emit(event, datas);
		}
		waiters.forEach(function(socket)
		{
			socket.emit(event, datas);
		})
	}
	this.addUser = function(socket)
	{
		let output = {
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
			indexToRemove: players.indexOf(socket),
			pseudo: socket.pseudo,
			event: "leave"
		};

		if (gameStarted) {
			round.forceChangeCurrentPlayer();
			if (players.length <= 1) {
				gameStarted = false;
				appendWaiters();
			}
		}
		players.splice(output.indexToRemove, 1);
		output.playersNumber = players.length;
		self.broadcast("Room:leave", output);
		console.log("User " + socket.pseudo + " leaved the room " + self.name + ".");
	}
	this.getFormattedPlayersInfos = function()
	{
		let output = [];

		players.forEach(function(socket) {
			output.push({
				pseudo: socket.pseudo,
				score: socket.score
			});
		});
		return (output);
	}
	this.getPassword = function()
	{
		return (PASSWORD);
	}
	this.getRound = function()
	{
		if (gameStarted)
			return (round);
		return (undefined);
	}
}
module.exports = Room;