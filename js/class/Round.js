const Redistributor = require("./Redistributor.js");
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
	let redistributor = new Redistributor(players);
	let isRedistributionActive = false;

	let initialise = function()
	{
		let hands;
		let output = {};
		let broadcastOutput = {};
		
		for (let i = 0; i < room.decksNumber; i++) {
			if (i > 0 && players.length < 5)
				break;
			deck.generate();
			deck.addJokers(room.jokersNumber);
		}
		hands = deck.distribute(players.length);
		broadcastOutput.cardsNbr = new Array(players.length);
		for (let i = 0, l = hands.length; i < l; i++) {
			players[i].hand = hands[i];
			output.hand = hands[i];
			broadcastOutput.cardsNbr[i] = hands[i].length;
			players[i].emit("Game:send_hand", output);
		}
		redistribute(broadcastOutput);
	}
	let reset = function()
	{
		let output = {};
		
		passed = 0;
		pattern = undefined;
		playedCards = [];
		output.pseudo = players[currentPlayer].pseudo;
		output.currentPlayer = currentPlayer;
		room.broadcast("Game:new_turn", output);
	}
	let start = function(output)
	{
		let index = ~~(Math.random() * players.length);
		let max = -1;
		
		isRedistributionActive = false;
		for (let i = 0, len = players.length; i < len; i++) {
			if (players[i].place > max) {
				index = i;
				max = players[i].place;
			}
			players[i].place = -1;
		}
		currentPlayer = index;
		output.starter = currentPlayer;
		output.starterPseudo = players[currentPlayer].pseudo;
		room.broadcast("Game:round_start", output);
	}
	let redistribute = function(broadcastOutput)
	{
		if (!redistributor.initialise(players)) {
			start(broadcastOutput);
		}
		else {
			isRedistributionActive = true;
			room.broadcast("Game:redistribute", {nbCards: 0});
			redistributor.prepare();
			timeout = setTimeout(function() {
				redistributor.force();
				start(broadcastOutput);
			}, 1000 * DELAY);
		}
	}
	let reverseCardOrder = function()
	{
		if (pattern === "0000") {
			revolution = !revolution;
			room.broadcast("Game:reverse", {
				pseudo: players[currentPlayer].pseudo,
				isRevolution: revolution
			});
		}
	}
	let setNewPattern = function(cards)
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
	let checkPattern = function(cards)
	{
		let cardId = 0;
		
		if (pattern == undefined) {
			return (setNewPattern(cards));
		}
		if (revolution && playedCards.length > 1)
			cardId = playedCards.length - 2;
		if (!revolution) {
			if (cards[0].strength <= playedCards[cardId].strength)
				return (false);
		}
		else {
			if (cards[0].strength >= playedCards[cardId].strength)
				return (false);
		}
		reverseCardOrder();
		return (pattern === Card.getPattern(cards));
	}
	let computeScore = function()
	{
		let output = 0;

		players.forEach(function(socket)
		{
			output += socket.hand.length;
		});
		return (output);
	}
	let computeTurn = function(socket, cards)
	{
		if (players[currentPlayer].id !== socket.id)
			return (false);
		Card.updateJokerValue(cards, revolution);
		if (cards.length > 0) {
			if (!checkPattern(cards))
				return (false);
			passed = 0;
			playedCards = cards;
		}
		else
			passed++;
		changeTurn(socket, cards);
		if (enders >= players.length - 1)
			return (true);
		if (passed >= players.length - enders - 1)
			reset();
		return (true);
	}
	let changeCurrentPlayer = function(socket, cards)
	{
		let output = {
			pseudo: socket.pseudo,
			newCards: cards,
			handLength: socket.hand.length
		};
		
		output.currentPlayer = currentPlayer;
		self.updateCurrentPlayer();
		output.nextPlayerId = currentPlayer;
		room.broadcast("Game:update", output);
		socket.emit("Game:update_hand", {hand: socket.hand});
	}
	let changeTurn = function(socket, cards)
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
			if ((cards[cards.length - 1].strength >= 12 && !revolution) 
				|| (cards[0].strength <= 0 && revolution)) {
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
	let managePlayerEnd = function(socket, id)
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
		if (enders == players.length - 1) {
			self.updateCurrentPlayer();
			players[currentPlayer].hand = [];
			managePlayerEnd(players[currentPlayer], currentPlayer);
		}
		return (enders >= players.length - 1);
	}

	this.analyse = function(socket, cards)
	{
		if (isRedistributionActive)
			redistributor.updateHands(socket, cards);
		else
			computeTurn(socket, cards);
	}
	this.updateCurrentPlayer = function(index = -1)
	{
		if (index >= 0) {
			if (index < currentPlayer)
				currentPlayer--;
			return (currentPlayer);
		}
		do {
			currentPlayer++;
			if (currentPlayer >= players.length)
				currentPlayer = 0;
		} while (players[currentPlayer].place != -1);
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			computeTurn(players[currentPlayer], []);
		}, 1000 * DELAY);
		return (currentPlayer);
	}
	this.isEnded = function()
	{
		if (enders == players.length || players.length <= 1) {
			clearTimeout(timeout);
			return (true);
		}
		return (false);
	}
	initialise();
}
module.exports = Round;