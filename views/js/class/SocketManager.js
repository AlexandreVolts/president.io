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
	var getSuffix = function(place)
	{
		if (place == 1)
			return ("st");
		if (place == 2)
			return ("nd");
		if (place == 3)
			return ("rd");
		return ("th");
	}
	var manageUserEvents = function(datas)
	{
		var message = "has " + datas.event + " the room.";
		var chat = game.getChat();
		
		playersNumber = datas.playersNumber;
		chat.writeMessage(datas.pseudo, message);
		if (datas.event === "join")
			chat.addUser(datas.pseudo);
		else
			chat.removeUser(datas.index);
	}
	var manageHand = function(datas)
	{
		if (datas.hand != undefined && datas.hand.length > 0)
			game.setHand(sortCards(datas.hand));
	}
	var updateGame = function(datas)
	{
		var hand = game.getHand();

		if (datas.nextPlayerId == socket.index)
			game.timer = new Timer();
		else
			game.timer = undefined;
		if (datas.newCards.length > 0) {
			hand.currentCards = datas.newCards;
			game.getChat().writeMessage(datas.pseudo, " overbidden.");
		}
		else
			game.getChat().writeMessage(datas.pseudo, " passed his turn.");
		hand.clearSelected();
	}
	var manageNewTurn = function(datas)
	{
		var hand = game.getHand();
		
		game.getChat().writeMessage(datas.pseudo, " won the turn !", "blue");
		hand.clearSelected();
		hand.currentCards = [];
	}
	var managePlayerEnd = function(datas)
	{
		var chat = game.getChat();
		var suffix = datas.place + getSuffix(datas.place);

		chat.updateScore(datas.index, datas.score);
		chat.writeMessage(datas.pseudo, " is the " + suffix + " to end !", "green");
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
	socket.on("Game:new_turn", manageNewTurn);
	socket.on("Game:player_end", managePlayerEnd);
}