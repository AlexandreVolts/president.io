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
	let bounds = {};
	
	this.name = name;
	this.roundsNumber = 5;
	this.jokersNumber = 2;
	this.decksNumber = 1;

	let appendWaiters = function()
	{
		players = players.concat(waiters);
		waiters.forEach(function(waiter)
		{
			self.removeUser(waiter);
			self.addUser(waiter);
		});
		waiters = [];
	}
	let prepareSummary = function()
	{
		let output = [];

		for (let i = players.length - 1; i >= 0; i--) {
			output.push({
				pseudo: players[i].pseudo,
				place: players[i].place,
				score: players[i].score
			});
		}
		return (output);
	}
	
	this.startRound = function()
	{
		appendWaiters();
		currentRound++;
		if (currentRound <= self.roundsNumber)
			round = new Round(self, players);
		else {
			self.broadcast("Game:end", {datas: prepareSummary()});
			setTimeout(function()
			{
				for (let i = players.length - 1; i >= 0; i--) {
					players[i].score = 0;
					players[i].place = -1;
				}
				round = new Round(self, players);
				currentRound = 0;
			}, 10000);
		}
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
		for (let i = waiters.length - 1; i >= 0; i--) {
			output.index = len - 1 + i;
			waiters[i].emit(event, output);
		}
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
		if (!gameStarted && players.length >= bounds.min && waiters.length == 0)
			self.startRound();
		console.log("User " + socket.pseudo + " has join the room " + self.name + ".");
		return (true);
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
				output.currentPlayer = round.updateCurrentPlayer(output.indexToRemove);
		}
		output.playersNumber = players.length;
		self.broadcast("Room:leave", output);
		console.log("User " + socket.pseudo + " leaved the room " + self.name + ".");
	}
	this.isFilled = function()
	{
		return (players.length + waiters.length >= bounds.max);
	}
	this.getFormattedPlayersInfos = function()
	{
		let output = [];

		players.forEach(function(socket) {
			output.push({
				pseudo: socket.pseudo,
				score: socket.score,
				place: socket.place
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
	this.setBounds = function(min, max)
	{
		bounds.min = min;
		bounds.max = max;
	}
}
module.exports = Room;