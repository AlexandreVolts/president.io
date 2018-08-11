var Card = {
	equals: function(card1, card2)
	{
		if (card1 == undefined || card2 == undefined)
			return (false);
		if (card1.value == card2.value
				&& card1.strength == card2.strength
				&& card1.color == card2.color) {
				return (true);
		}
		return (false);
	},
	indexOf: function(array, card)
	{
		for (let i = 0, len = array.length; i < len; i++) {
			if (Card.equals(array[i], card))
				return (i);
		}
		return (-1);
	}
};