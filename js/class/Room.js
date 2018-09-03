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

	var appendWaiters = function()
	{
		players = players.concat(waiters);
		waiters.forEach(function(waiter)
		{
			self.removeUser(waiter);
			self.addUser(waiter);
		});
		waiters = [];
	}
	
	this.startRound = function()
	{
		gameStarted = false;
		appendWaiters();
		currentRound++;
		round = new Round(self, players);
		gameStarted = true;
	}
	this.broadcast = function(event, datas)
	{
		let output = datas;
		let len = players.length;

		for(let i = 0; i < len; i++) {
			output.index = i;
			players[i].emit(event, output);
		}
		for (let i = 0, wlen = waiters.length; i < wlen; i++) {
			output.index = len - 1 + i;
			waiters[i].emit(event, output);
		};
	}
	this.addUser = function(socket)
	{
		let output = {
			pseudo: socket.pseudo,
			event: "join",
			waiter: gameStarted
		};

		if (!gameStarted)
			players.push(socket);
		else
			waiters.push(socket);
		output.playersNumber = players.length;
		self.broadcast("Room:join", output);
		if (!gameStarted && players.length >= 4 && waiters.length == 0)
			self.startRound();
		console.log("User " + socket.pseudo + " has join the room " + self.name + ".");
	}
	this.removeUser = function(socket)
	{
		let output = {
			indexToRemove: players.indexOf(socket),
			pseudo: socket.pseudo,
			event: "leave",
			waiter: false
		};

		if (output.indexToRemove != -1)
			players.splice(output.indexToRemove, 1);
		else {
			output.waiter = true;
			output.indexToRemove = players.length + waiters.indexOf(socket);
			waiters.splice(waiters.indexOf(socket), 1);
		}
		if (gameStarted) {
			if (round.isEnded()) {
				gameStarted = false;
				round = undefined;
			}
			else
				output.currentPlayer = round.updateCurrentPlayer(-1);
		}
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
		waiters.forEach(function(socket) {
			output.push({
				pseudo: socket.pseudo,
				score: 0
			});
		})
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