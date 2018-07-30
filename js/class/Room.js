const Deck = require("./Deck.js");

var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let players = [];
	let waiters = [];
	let deck = new Deck();
	let gameStarted = false;
	
	this.name = name;

	deck.generate();
	deck.shuffle(0.9);
	
	var startGame = function()
	{
		let hands = deck.distribute(players.length);
		let output = {};
		
		for (let i = 0, l = hands.length; i < l; i++) {
			players[i].hand = hands[i];
			output.hand = hands[i];
			console.log(hands[i]);
			players[i].emit("Game:send_hand", output);
		}
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
		let output = {pseudo: socket.pseudo};
		
		if (!gameStarted) {
			players.push(socket);
			if (players.length >= 4)
				startGame();
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
		let output = {pseudo: socket.pseudo};

		players.splice(index, 1);
		output.playersNumber = players.length;
		self.broadcast("Roome:leave", output);
		console.log("User " + socket.pseudo + " leaved the room " + self.name + ".");
	}
	this.getPassword = function()
	{
		return (PASSWORD);
	}
}
module.exports = Room;