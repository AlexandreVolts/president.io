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
			&& array[i].strength == card.strength
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
	
	for (let i = 0, len = cards.length; i < len; i++) 
		output += cards[i].strength - cards[0].strength;
	return (output);
}
module.exports = Card;