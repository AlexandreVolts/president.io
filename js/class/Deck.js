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
	this.shuffle = function(degree = 0.5)
	{
		let j;
		let swap;
		
		for (let i = 0, len = cards.length * degree; i < len; i++) {
			j = rand(cards.length);
			swap = cards[j];
			cards[j] = cards[i];
			cards[i] = swap;
		}
	}
	this.distribute = function(nbPlayers)
	{
		let output = new Array(nbPlayers);

		for (let i = 0; i < nbPlayers; i++)
			output[i] = [];
		for (let i = 0; cards.length > 0; i++)
			output[i % nbPlayers].push(cards.shift());
		return (output);
	}
}
module.exports = Deck;