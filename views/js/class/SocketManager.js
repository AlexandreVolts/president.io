let SocketManager = function(socket, game)
{
	let playersNumber = 0;
	let chat = new Chat(socket);
	let form = new Form(socket, chat);
	let musicPlayer = new MusicPlayer("musicVolume");

	musicPlayer.change(SYS.Music.PATH + SYS.Music.WAITING_THEME);
	socket.on("disconnect", function()
	{
		chat.writeMessage("", "Connection was lost. All datas were destroyed.", "red");
		chat.writeMessage("", "Check your connection and refresh this page. The server may also be down.", "red");
	});
	let sortCards = function(array)
	{
		let cardMin;
		let index;
		let output = [];

		for (let i = 0, len = array.length; i < len; i++) {
			cardMin = array[0];
			index = 0;
			for (let j = 0, len2 = array.length; j < len2; j++) {
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
	let manageUserEvents = function(datas)
	{
		let action = datas.event == "join" ? " joined" : " left";
		let waiter = datas.waiter ? "[Spectator] " : "[Player] ";
		
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
	let manageHand = function(datas)
	{
		game.getHand().clearSelected();
		game.setHand(sortCards(datas.hand));
	}
	let manageNewMessage = function(datas)
	{
		chat.writeMessage(datas.pseudo + ":", datas.content.toLowerCase(), "yellow");
	}
	let manageRedistribution = function(datas)
	{
		game.getHand().isPlayerTurn = true;
		chat.activate(-1);
		for (let i = 0; i < playersNumber; i++) {
			chat.getUser(i).showCards(0);
		}
		if (datas.nbCards > 0) {
			game.timer = new Timer();
			if (datas.winner)
				chat.writeImportantMessage("", "Give " + datas.nbCards + " card(s) of your choice to " + datas.opposite + ".", "pink");
			else
				chat.writeImportantMessage("", "Give your " + datas.nbCards + " best card(s) to " + datas.opposite + ".", "pink");
		}
		else
			chat.writeMessage("", "Cards will be redistributed.", "orange");
	}
	let manageStart = function(datas)
	{
		let hand = game.getHand();
		
		game.timer = undefined;
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
		musicPlayer.rand(SYS.Music.PATH, SYS.Music.IN_GAME_THEMES);
	}
	let updateGame = function(datas)
	{
		let hand = game.getHand();

		hand.clearSelected();
		hand.isPlayerTurn = (datas.nextPlayerId == datas.index);
		if (hand.isPlayerTurn)
			game.timer = new Timer();
		else
			game.timer = undefined;
		if (datas.newCards.length > 0) {
			hand.getMiddle().setCurrentCards(datas.newCards);
			chat.writeMessage(datas.pseudo, " overbidden.");
		}
		else
			chat.writeMessage(datas.pseudo, " passed.");
		chat.activate(datas.nextPlayerId);
		chat.getUser(datas.currentPlayer).showCards(datas.handLength);
	}
	let manageRevolution = function(datas)
	{
		game.getHand().revolution = datas.isRevolution;
		chat.writeImportantMessage("", "REVOLUTION !", "red");
	}
	let manageNewTurn = function(datas)
	{
		let hand = game.getHand();
		
		hand.isPlayerTurn = (datas.currentPlayer == datas.index);
		if (hand.isPlayerTurn)
			game.timer = new Timer();
		hand.clearSelected();
		hand.getMiddle().clear();
		chat.activate(datas.currentPlayer);
		chat.writeMessage(datas.pseudo, " won the turn !", "cyan");
	}
	let managePlayerEnd = function(datas)
	{
		let suffix = datas.place + Utils.getSuffix(datas.place);
		let hand = game.getHand();

		chat.getUser(datas.enderIndex).update(datas.score);
		chat.getUser(datas.enderIndex).setRole(Utils.getRole(datas.place, playersNumber));
		chat.writeMessage(datas.pseudo, " is the " + suffix + " to end !", "lime");
		chat.resize();
		if (datas.place >= playersNumber) {
			hand.getMiddle().clear();
			hand.revolution = false;
			game.timer = undefined;
		}
	}
	let manageGameEnd = function(datas)
	{
		showScorePanel(datas.datas);
		for (let i = playersNumber - 1; i >= 0; i--)
			chat.getUser(i).update(0, true);
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);
	socket.on("Chat:message", manageNewMessage);
	socket.on("Game:send_hand", manageHand);
	socket.on("Game:redistribute", manageRedistribution);
	socket.on("Game:round_start", manageStart);
	socket.on("Game:update", updateGame);
	socket.on("Game:update_hand", manageHand);
	socket.on("Game:reverse", manageRevolution);
	socket.on("Game:new_turn", manageNewTurn);
	socket.on("Game:player_end", managePlayerEnd);
	socket.on("Game:end", manageGameEnd);
}