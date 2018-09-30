var Card = function(name, value, strength, color)
{
	this.name = name;
	this.value = value;
	this.strength = strength;
	this.color = color;
}

Card.indexOf = function(array, card)
{
	let output = -1;

	for (let i = 0, len = array.length; i < len; i++) {
		if (array[i].value == card.value
			&& array[i].name == card.name
			&& array[i].color == card.color) {
			output = i;
			break;
		}
	}
	return (output);
}
Card.getPattern = function(cards)
{
	let output = "";
	
	for (let i = 0, len = cards.length; i < len; i++) {
		output += cards[i].strength - cards[0].strength;
	}
	return (output);
}
Card.updateJoker = function(cards, revolution)
{
	let position = [];
	let strength = -1;

	for (let i = cards.length - 1; i >= 0; i--) {
		if (cards[i].strength == 13)
			position.push(i);
		else
			strength = cards[i].strength;
	}
	if (position.length == 0)
		return (false);
	if (strength == -1) {
		for (let i = position.length - 1; i >= 0; i--)
			cards[i].strength = revolution ? 0 : 12;
		return (true);
	}
	for (let i = position.length - 1; i >= 0; i--)
		cards[position[i]].strength = strength;
	return (true);
}
module.exports = Card;