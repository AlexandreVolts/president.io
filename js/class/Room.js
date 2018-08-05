const Deck = require("./Deck.js");
const Card = require("./Card.js");
const POSSIBLE_PATTERNS = ["0", "00", "000", "0000", "012", "0123"];

var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let players = [];
	let waiters = [];
	let deck = new Deck();
	let gameStarted = false;
	let currentPlayer = 0;
	let pattern;
	
	this.name = name;

	//deck.generate(); //!!!
	//deck.shuffle(0.9); //!!!
	var startGame = function()
	{
		let hands;
		let output = {};

		deck.generate();
		deck.shuffle(0.9);
		hands = deck.distribute(players.length);
		for (let i = 0, l = hands.length; i < l; i++) {
			players[i].hand = hands[i];
			output.hand = hands[i];
			players[i].emit("Game:send_hand", output);
		}
		gameStarted = true;
		currentPlayer = Math.floor(Math.random() * players.length);
	}
	var checkPattern = function(cards)
	{
		let strengths = new Array(cards.length);
		let cardsPattern = "";
		
		strengths[0] = 0;
		for (let i = 0, len = cards.length; i < len; i++) 
			cardsPattern += cards[i].strength - cards[0].strength;
		console.log(cardsPattern);
		return (true);
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
			//socket.hand = deck.distribute(4)[0]; //!!!
			//socket.emit("Game:send_hand", {hand: socket.hand}); //!!!
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
	this.computeTurn = function(socket, cards)
	{
		let output = {
			pseudo: socket.pseudo,
			newCards: cards
		};
		let index;
		
		if (players[currentPlayer].id !== socket.id || !checkPattern(cards))
			return (false);
		currentPlayer++;
		if (currentPlayer >= players.length)
			currentPlayer = 0;
		if (cards != undefined) {
			cards.forEach(function(card)
			{
				index = Card.indexOf(socket.hand, card);
				socket.hand.splice(index, 1);
			});
		}
		self.broadcast("Game:update", output);
		socket.emit("Game:update_hand", {hand: socket.hand});
		return (true);
	}
	this.removeUser = function(socket)
	{
		let index = players.indexOf(socket);
		let output = {pseudo: socket.pseudo};

		if (players[currentPlayer].id === socket.id && currentPlayer == players.length - 1)
			currentPlayer = 0;
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