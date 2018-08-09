const Deck = require("./Deck.js");
const Card = require("./Card.js");
const POSSIBLE_PATTERNS = ["0", "00", "000", "0000", "012", "0123"];

var Round = function(room, players)
{
	let deck = new Deck();
	let currentPlayer = 0;
	let passed = 0;
	let pattern;
	let playedCards = [];
	let enders = 0;

	var initialise = function()
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
		currentPlayer = Math.floor(Math.random() * players.length);
	}
	var reset = function()
	{
		let output = {};
		
		passed = 0;
		pattern = undefined;
		playedCards = [];
		output.pseudo = players[currentPlayer].pseudo;
		room.broadcast("Game:new_turn", output);
	}
	var setNewPattern = function(cards)
	{
		let output = false;
		let cardsPattern = Card.getPattern(cards);
		
		POSSIBLE_PATTERNS.forEach(function(possiblePattern)
		{
			if (possiblePattern === cardsPattern) {
				pattern = cardsPattern;
				output = true;
			}
		});
		return (output);
	}
	var checkPattern = function(cards)
	{
		if (pattern == undefined) {
			return (setNewPattern(cards));
		}
		if (cards[0].strength <= playedCards[0].strength)
			return (false);
		return (pattern === Card.getPattern(cards));
	}
	var changeCurrentPlayer = function(socket, cards)
	{
		let output = {
			pseudo: socket.pseudo,
			newCards: cards
		};

		do {
			currentPlayer++;
			if (currentPlayer >= players.length)
				currentPlayer = 0;
		} while (players[currentPlayer].place != -1);
		cards.forEach(function(card)
		{
			index = Card.indexOf(socket.hand, card);
			socket.hand.splice(index, 1);
		});
		if (socket.hand.length <= 0) {
			socket.place = enders;
			enders++;
			console.log("A new player ended.");
			if (enders >= players.length - 1)
				room.startRound();
		}
		room.broadcast("Game:update", output);
		socket.emit("Game:update_hand", {hand: socket.hand});
	}

	this.computeTurn = function(socket, cards)
	{		
		if (players[currentPlayer].id !== socket.id)
			return (false);
		if (cards.length > 0) {
			if (!checkPattern(cards))
				return (false);
			passed = 0;
			playedCards = cards;
		}
		else
			passed++;
		changeCurrentPlayer(socket, cards);
		if (passed >= players.length - enders - 1)
			reset();
		return (true);
	}
	this.getCurrentPlayer = function()
	{
		return (currentPlayer);
	}
	this.setCurrentPlayer = function(newCurrent)
	{
		if (newCurrent >= 0 && newCurrent < players.length)
			currentPlayer = newCurrent;
	}
	initialise();
}
module.exports = Round;