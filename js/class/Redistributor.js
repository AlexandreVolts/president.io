var Redistributor = function()
{
	let self = this;
	let validPlayers;
	
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
	
	this.initialise = function(players)
	{
		validPlayers = players.filter(function(socket)
		{
			return (socket.place != -1);
		});
		validPlayers = sortPlayers();
		for (let i = 0, len = validPlayers.length; (len - 1) - i > 0; i++) {
			j = (len - 1) - i;
			if (i == j || validPlayers[i].place + validPlayers[j].place != len - 1) {
				validPlayers.splice(j, 1);
				if (j != i)
					validPlayers.splice(i, 1);
				len = validPlayers.length;
				i = 0;
			}
		}
		console.log(validPlayers.length);
		if (validPlayers.length > 0)
			return (true);
		return (false);
	}
}

module.exports = Redistributor;