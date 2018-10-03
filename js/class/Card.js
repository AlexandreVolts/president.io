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
Card.updateJokerValue = function(cards, revolution)
{
	let positions = [];
	let strength = -1;
	let isSequence = false;
	let min = 0;

	for (let i = cards.length - 1; i >= 0; i--) {
		if (cards[i].strength == 13)
			positions.push(i);
		else {
			isSequence = strength != -1 && strength != cards[i].strength;
			strength = cards[i].strength;
			if (isSequence)
				min = cards[i].strength - i;
		}
	}
	if (positions.length == 0)
		return (false);
	if (min + positions[positions.length - 1] > 12 || min + positions[0] < 0)
		return (false);
	if (strength == -1) {
		for (let i = positions.length - 1; i >= 0; i--)
			cards[i].strength = revolution ? 0 : 12;
		return (true);
	}
	for (let i = positions.length - 1; i >= 0; i--) {
		if (isSequence)
			cards[positions[i]].strength = min + positions[i];
		else
			cards[positions[i]].strength = strength;
	}
	return (true);
}
module.exports = Card;