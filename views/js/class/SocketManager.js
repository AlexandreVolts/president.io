var SocketManager = function(socket, game)
{
	var playersNumber = 0;
	var chat = new Chat();
	var form = new Form(socket, chat);
	var musicPlayer = new MusicPlayer();

	musicPlayer.changeMusic(SYS.Music.WAITING_THEME);
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
		var action = datas.event == "join" ? " joined" : " left";
		var waiter = datas.waiter ? "[Spectator] " : "[Player] ";
		
		playersNumber = datas.playersNumber;
		chat.writeMessage(waiter + datas.pseudo, action + " the room.");
		if (datas.event === "join")
			chat.addUser(datas.pseudo);
		else {
			chat.removeUser(datas.indexToRemove);
			if (datas.currentPlayer != undefined) {
				chat.activate(datas.currentPlayer);
				game.getHand().isPlayerTurn = (datas.currentPlayer == datas.index);
			}
		}
	}
	var manageHand = function(datas)
	{
		game.setHand(sortCards(datas.hand));
	}
	var manageStart = function(datas)
	{
		var hand = game.getHand();
		
		for (let i = 0, len = datas.cardsNbr.length; i < len; i++)
			chat.getUser(i).showCards(datas.cardsNbr[i]);
		hand.isPlayerTurn = (datas.starter == datas.index);
		if (hand.isPlayerTurn)
			chat.writeImportantMessage("", "You start the round !");
		else {
			chat.addSeparator();
			chat.writeMessage(datas.starterPseudo, " starts the round.");
		}
		chat.resize();
		chat.activate(datas.starter);
		musicPlayer.changeMusic(SYS.Music.IN_GAME_THEME);
	}
	var updateGame = function(datas)
	{
		var hand = game.getHand();

		hand.clearSelected();
		hand.isPlayerTurn = (datas.nextPlayerId == datas.index);
		if (hand.isPlayerTurn)
			game.timer = new Timer();
		else
			game.timer = undefined;
		if (datas.newCards.length > 0) {
			hand.getMiddle().currentCards = datas.newCards;
			chat.writeMessage(datas.pseudo, " overbidden.");
		}
		else
			chat.writeMessage(datas.pseudo, " passed his turn.");
		chat.activate(datas.nextPlayerId);
		chat.getUser(datas.currentPlayer).showCards(datas.handLength);
	}
	var manageRevolution = function(datas)
	{
		game.getHand().revolution = datas.isRevolution;
		chat.writeImportantMessage("", "REVOLUTION !", "red");
	}
	var manageNewTurn = function(datas)
	{
		var hand = game.getHand();
		
		hand.isPlayerTurn = (datas.currentPlayer == datas.index);
		hand.clearSelected();
		hand.getMiddle().clear();
		chat.activate(datas.currentPlayer);
		chat.writeMessage(datas.pseudo, " won the turn !", "cyan");
	}
	var managePlayerEnd = function(datas)
	{
		var suffix = datas.place + getSuffix(datas.place);
		var hand = game.getHand();

		chat.getUser(datas.enderIndex).update(datas.score);
		chat.writeMessage(datas.pseudo, " is the " + suffix + " to end !", "lime");
		chat.resize();
		if (datas.place >= playersNumber - 1) {
			hand.getMiddle().clear();
			hand.revolution = false;
			game.timer = undefined;
			chat.writeMessage("", "There is only one in-game player. New Round starts.", "red");
		}
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);
	socket.on("Game:send_hand", manageHand);
	socket.on("Game:round_start", manageStart);
	socket.on("Game:update", updateGame);
	socket.on("Game:update_hand", manageHand);
	socket.on("Game:reverse", manageRevolution);
	socket.on("Game:new_turn", manageNewTurn);
	socket.on("Game:player_end", managePlayerEnd);
}