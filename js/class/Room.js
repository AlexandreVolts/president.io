const Round = require("./Round.js");

var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let players = [];
	let waiters = [];
	let currentRound = 0;
	let roundNumber = 5;
	let gameStarted = false;
	let round;
	
	this.name = name;

	/* 
		TODO: 	- Manage when all played have passed 
	*/
	var startRound = function()
	{
		currentRound++;
		round = new Round(self, players);
		gameStarted = true;
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
			pseudo: socket.pseudo,
			event: "join"
		};
		
		if (!gameStarted) {
			players.push(socket);
			if (players.length >= 4)
				startRound();
		}
		else
			waiters.push(socket);
		output.playersNumber = players.length;
		self.broadcast("Room:join", output);
		console.log("User " + socket.pseudo + " has join the room " + self.name + ".");
	}
	this.removeUser = function(socket)
	{
		let index = players.indexOf(socket);
		let currentPlayer;
		let output = {
			pseudo: socket.pseudo,
			event: "leave"
		};

		if (gameStarted) {
			currentPlayer = round.getCurrentPlayer();
			if (players[currentPlayer].id === socket.id && currentPlayer == players.length - 1)
				round.setCurrentPlayer(0);
		}
		players.splice(index, 1);
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