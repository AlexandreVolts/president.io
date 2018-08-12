const Deck = require("./Deck.js");
const Card = require("./Card.js");
const POSSIBLE_PATTERNS = ["0", "00", "000", "0000", "012", "0123"];
const DELAY = 30;

var Round = function(room, players)
{
	let self = this;
	let deck = new Deck();
	let currentPlayer = 0;
	let passed = 0;
	let pattern;
	let playedCards = [];
	let enders = 0;
	let timeout;

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
	var computeScore = function()
	{
		let output = 0;

		players.forEach(function(socket)
		{
			output += socket.hand.length;
		});
		return (output);
	}
	var changeCurrentPlayer = function(socket, cards)
	{
		let output = {
			pseudo: socket.pseudo,
			newCards: cards
		};

		cards.forEach(function(card)
		{
			index = Card.indexOf(socket.hand, card);
			socket.hand.splice(index, 1);
		});
		if (socket.hand.length == 0) {
			if (managePlayerEnd(socket))
				return;
		}
		do {
			currentPlayer++;
			if (currentPlayer >= players.length)
				currentPlayer = 0;
		} while (players[currentPlayer].place != -1);
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			self.computeTurn(players[currentPlayer], []);
		}, 1000 * DELAY);
		output.nextPlayerId = currentPlayer;
		room.broadcast("Game:update", output);
		socket.emit("Game:update_hand", {hand: socket.hand});
	}
	var managePlayerEnd = function(socket)
	{
		let output = {
			pseudo: socket.pseudo,
			enderIndex: currentPlayer,
			place: enders + 1
		};
		
		socket.place = enders;
		socket.score += computeScore();
		enders++;
		output.score = socket.score;
		if (enders >= players.length - 1) {
			clearTimeout(timeout);
			room.startRound();
		}
		room.broadcast("Game:player_end", output);
		return (enders >= players.length - 1);
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
			if (cards[cards.length - 1].value == 1) {
				reset();
				currentPlayer--;
			}
		}
		else {
			if (pattern == undefined)
				return (false);
			passed++;
		}
		changeCurrentPlayer(socket, cards);
		if (enders >= players.length - 1)
			return (true);
		if (passed >= players.length - enders - 1)
			reset();
		return (true);
	}
	this.forceChangeCurrentPlayer = function()
	{
		if (currentPlayer >= players.length)
			currentPlayer++;
	}
	initialise();
}
module.exports = Round;