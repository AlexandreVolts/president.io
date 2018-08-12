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
		
		socket.index = datas.index;
		playersNumber = datas.playersNumber;
		chat.writeMessage(datas.pseudo, message);
		if (datas.event === "join")
			chat.addUser(datas.pseudo);
		else
			chat.removeUser(datas.indexToRemove);
	}
	var manageHand = function(datas)
	{
		game.setHand(sortCards(datas.hand));
	}
	var updateGame = function(datas)
	{
		var hand = game.getHand();

		hand.clearSelected();
		if (datas.nextPlayerId == socket.index)
			game.timer = new Timer();
		else
			game.timer = undefined;
		if (datas.newCards.length > 0) {
			hand.getMiddle().currentCards = datas.newCards;
			if (datas.newCards[datas.newCards.length - 1].value == 1)
				hand.getMiddle().clear();
			game.getChat().writeMessage(datas.pseudo, " overbidden.");
		}
		else
			game.getChat().writeMessage(datas.pseudo, " passed his turn.");
	}
	var manageNewTurn = function(datas)
	{
		var hand = game.getHand();
		
		hand.clearSelected();
		hand.getMiddle().clear();
		game.getChat().writeMessage(datas.pseudo, " won the turn !", "blue");
	}
	var managePlayerEnd = function(datas)
	{
		var chat = game.getChat();
		var suffix = datas.place + getSuffix(datas.place);

		game.getHand().getMiddle().clear();
		chat.updateScore(datas.enderIndex, datas.score);
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