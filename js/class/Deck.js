const Card = require("./Card.js");
const NAMES = ["As", "Two", "Three", "Four", "Five",
				"Six", "Seven", "Eight", "Nine", "Ten",
				"Jockey", "Queen", "King"];
const COLORS = ["Heart", "Diamond", "Club", "Spade"];

function rand(max)
{
	return (Math.floor(Math.random() * max));
}

var Deck = function()
{
	let cards = [];
	let discards = [];
	
	this.generate = function()
	{
		let strength;
		
		for (let i = 0, l = NAMES.length; i < l; i++) {
			for (let j = 0, m = COLORS.length; j < m; j++) {
				strength = i - 2;
				if (strength < 0)
					strength += NAMES.length;
				cards.push(new Card(NAMES[i], i, strength, COLORS[j]));
			}
		}
	}
	this.shuffle = function(degree = 0.5)
	{
		let j;
		let swap;
		
		for (let i = 0, l = cards.length * degree; i < l; i++) {
			j = rand(cards.length);
			swap = cards[j];
			cards[j] = cards[i];
			cards[i] = swap;
		}
		console.log(cards);
	}
}
module.exports = Deck;