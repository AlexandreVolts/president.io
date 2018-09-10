const Card = require("./Card.js");
const NAMES = ["As", "Two", "Three", "Four", "Five",
				"Six", "Seven", "Eight", "Nine", "Ten",
				"Jockey", "Queen", "King"];
const COLORS = ["Spade", "Club", "Diamond", "Heart"];

function rand(max)
{
	return (Math.floor(Math.random() * max));
}

var Deck = function()
{
	let cards = [];
	
	this.generate = function()
	{
		let strength;
		
		for (let i = 0, l = NAMES.length; i < l; i++) {
			for (let j = 0, m = COLORS.length; j < m; j++) {
				strength = i - 2;
				if (strength < 0)
					strength += NAMES.length;
				cards.push(new Card(NAMES[i], i, strength, j));
			}
		}
	}
	this.addJokers = function(n = 2)
	{
		for (let i = 0; i < n; i++)
			cards.push(new Card("Joker", NAMES.length, NAMES.length, 0));
	}
	this.distribute = function(nbPlayers)
	{
		let output = new Array(nbPlayers);
		let card;

		for (let i = 0; i < nbPlayers; i++)
			output[i] = [];
		for (let i = 0; cards.length > 0; i++) {
			card = cards.splice(rand(cards.length), 1)[0];
			output[i % nbPlayers].push(card);
		}
		return (output);
	}
}
module.exports = Deck;