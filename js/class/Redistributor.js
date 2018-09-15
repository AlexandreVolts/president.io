const Card = require("./Card.js");

var Redistributor = function()
{
	let self = this;
	let validPlayers;
	let substract;
	let initialLength;
	
	let computeNbCards = function(index)
	{
		if (index < validPlayers.length / 2)
			return (Math.floor(validPlayers.length / 2) - index);
		return ((index + 1) - Math.floor(validPlayers.length / 2));
	}
	let sortPlayers = function()
	{
		let playerMin;
		let index;
		let output = [];

		for (let i = 0, len = validPlayers.length; i < len; i++) {
			playerMin = validPlayers[0];
			index = 0;
			for (let j = 0, len2 = validPlayers.length; j < len2; j++) {
				if (validPlayers[j].place < playerMin.place) {
					playerMin = validPlayers[j];
					index = j;
				}
			}
			output.push(playerMin);
			validPlayers.splice(index, 1);
		}
		return (output);
	}
	let transfertCards = function(socket, cards, isWinner = true)
	{
		let index;
		let opposite = (validPlayers.length - 1);
		let target;
		let len = cards.length;

		if (!isWinner)
			opposite -= (socket.place - substract);
		else
			opposite -= socket.place;
		target = validPlayers[opposite];
		for (let i = len - 1; i >= 0; i--) {
			index = Card.indexOf(socket.hand, cards[i]);
			if (index != -1) {
				if (!isWinner && socket.hand[index].strength < getStrongestCard(socket.hand).strength)
					return;
				socket.hand.splice(index, 1);
			}
			target.hand.push(cards[i]);
		}
		socket.redistributed = true;
		socket.emit("Game:send_hand", {hand: socket.hand});
		target.emit("Game:send_hand", {hand: target.hand});
	}
	let getStrongestCard = function(hand)
	{
		let output = hand[0];
		
		hand.forEach(function(card) {
			if (card.strength > output.strength)
				output = card;
		});
		return (output);
	}
	
	this.initialise = function(players)
	{
		let j;
		
		substract = 0;
		validPlayers = players.filter(function(socket)
		{
			return (socket.place != -1);
		});
		initialLength = validPlayers.length;
		validPlayers = sortPlayers();
		for (let i = 0, len = validPlayers.length; (len - 1) - i > 0; i++) {
			j = (len - 1) - i;
			if (i == j || validPlayers[i].place + validPlayers[j].place != initialLength - 1) {
				validPlayers.splice(j, 1);
				substract++;
				if (j != i) {
					validPlayers.splice(i, 1);
					substract++;
				}
				len = validPlayers.length;
				i = -1;
			}
		}
		return (validPlayers.length > 0);
	}
	this.prepare = function()
	{
		let output = {};
		
		for (let i = 0, len = validPlayers.length; i < len; i++) {
			validPlayers[i].redistributed = false;
			output.winner = (i < len / 2);
			if (i < len / 2)
				output.nbCards = Math.floor(len / 2) - i;
			else
				output.nbCards = (i + 1) - Math.floor(len / 2);
			output.opposite = validPlayers[(len - 1) - i].pseudo;
			validPlayers[i].emit("Game:redistribute", output);
		}
	}
	this.force = function()
	{
		let len = validPlayers.length;
		let cards;
		let index;
		let card;
		
		for (let i = len - 1; i >= 0; i--) {
			if (validPlayers[i].redistributed)
				continue;
			cards = [];
			for (let j = computeNbCards(i); j > 0; j--) {
				card = getStrongestCard(validPlayers[i].hand);
				index = Card.indexOf(validPlayers[i].hand, card);
				cards.push(validPlayers[i].hand.splice(index, 1)[0]);
			}
			transfertCards(validPlayers[i], cards, (validPlayers[i].place < len / 2));
		}
	}
	this.updateHands = function(socket, cards)
	{
		let nbCards;
		let len = validPlayers.length;
		
		if (socket.redistributed || cards.length != computeNbCards(socket.place))
			return;
		transfertCards(socket, cards, (socket.place < len / 2));
	}
}

module.exports = Redistributor;