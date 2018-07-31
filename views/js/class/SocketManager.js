var SocketManager = function(socket, game)
{
	var playersNumber = 0;

	var manageUserEvents = function(datas)
	{
		playersNumber = datas.playersNumber;
	}
	var manageHand = function(datas)
	{
		var cardMin;
		var index;
		
		game.hand = [];
		for (var i = 0, len = datas.hand.length; i < len; i++) {
			cardMin = datas.hand[0];
			index = 0;
			for (var j = 0, len2 = datas.hand.length; j < len2; j++) {
				if (datas.hand[j].strength < cardMin.strength) {
					cardMin = datas.hand[j];
					index = j;
				}
			}
			game.hand.push(cardMin);
			datas.hand.splice(index, 1);
		}
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);
	socket.on("Game:send_hand", manageHand);
}