var SocketManager = function(socket, game)
{
	var playersNumber = 0;

	var sortCards = function(array)
	{
		var cardMin;
		var index;
		var output = [];

		for (var i = 0, len = array.length; i < len; i++) {
			cardMin = array[0];
			index = 0;
			for (var j = 0, len2 = array.length; j < len2; j++) {
				if (array[j].strength < cardMin.strength) {
					cardMin = array[j];
					index = j;
				}
			}
			output.push(cardMin);
			array.splice(index, 1);
		}
		return (output);
	}
	var manageUserEvents = function(datas)
	{
		playersNumber = datas.playersNumber;
	}
	var manageHand = function(datas)
	{
		if (datas.hand != undefined)
			game.setHand(sortCards(datas.hand));
	}
	var updateGame = function(datas)
	{
		var hand = game.getHand();
		
		console.log(datas);
		if (datas.newCards != undefined)
			hand.currentCards = datas.newCards;
		hand.clearSelected();
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);
	socket.on("Game:send_hand", manageHand);
	socket.on("Game:update", updateGame);
	socket.on("Game:update_hand", manageHand);
}