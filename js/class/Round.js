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
	let revolution = false;

	var initialise = function()
	{
		let hands;
		let output = {};
		let broadcastOutput = {};
		
		deck.generate();
		hands = deck.distribute(players.length);
		broadcastOutput.cardsNbr = new Array(players.length);
		for (let i = 0, l = hands.length; i < l; i++) {
			players[i].hand = hands[i];
			output.hand = hands[i];
			broadcastOutput.cardsNbr[i] = hands[i].length;
			players[i].emit("Game:send_hand", output);
		}
		currentPlayer = Math.floor(Math.random() * players.length);
		broadcastOutput.starter = currentPlayer;
		broadcastOutput.starterPseudo = players[currentPlayer].pseudo;
		room.broadcast("Game:round_start", broadcastOutput);
	}
	var reset = function()
	{
		let output = {};
		
		passed = 0;
		pattern = undefined;
		playedCards = [];
		output.pseudo = players[currentPlayer].pseudo;
		output.currentPlayer = currentPlayer;
		room.broadcast("Game:new_turn", output);
	}
	var reverseCardOrder = function()
	{
		if (pattern === "0000") {
			revolution = !revolution;
			room.broadcast("Game:reverse", {
				pseudo: players[currentPlayer].pseudo,
				isRevolution: revolution
			});
		}
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
		reverseCardOrder();
		return (output);
	}
	var checkPattern = function(cards)
	{
		if (pattern == undefined) {
			return (setNewPattern(cards));
		}
		if (!revolution) {
			if (cards[0].strength <= playedCards[0].strength)
				return (false);
		}
		else {
			if (cards[0].strength >= playedCards[0].strength)
				return (false);
		}
		reverseCardOrder();
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
			newCards: cards,
			handLength: socket.hand.length
		};
		
		output.currentPlayer = currentPlayer;
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
	var changeTurn = function(socket, cards)
	{
		let save = currentPlayer;
		let tmp;

		cards.forEach(function(card)
		{
			index = Card.indexOf(socket.hand, card);
			socket.hand.splice(index, 1);
		});
		changeCurrentPlayer(socket, cards);
		if (cards.length > 0) {
			if ((cards[cards.length - 1].value == 1 && !revolution) 
				|| (cards[cards.length - 1].value == 2 && revolution)) {
				tmp = currentPlayer;
				currentPlayer = save;
				reset();
			}
		}
		if (socket.hand.length == 0) {
			managePlayerEnd(socket, save);
			if (tmp != undefined)
				currentPlayer = tmp;
		}
	}
	var managePlayerEnd = function(socket, id)
	{
		let output = {
			pseudo: socket.pseudo,
			enderIndex: id,
			place: enders + 1
		};
		
		socket.place = enders;
		socket.score += computeScore();
		enders++;
		passed--;
		output.score = socket.score;
		room.broadcast("Game:player_end", output);
		if (enders >= players.length - 1) {
			clearTimeout(timeout);
			room.startRound();
		}
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
		}
		else {
			if (pattern == undefined)
				return (false);
			passed++;
		}
		changeTurn(socket, cards);
		if (enders >= players.length - 1)
			return (true);
		if (passed >= players.length - enders - 1)
			reset();
		return (true);
	}
	this.forceChangeCurrentPlayer = function()
	{
		if (currentPlayer >= players.length)
			currentPlayer = 0;
		return (currentPlayer);
	}
	initialise();
}
module.exports = Round;