var SocketManager = function(socket, game)
{
	var playersNumber = 0;
	
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);
	socket.on("Game:send_hand", manageHand);

	var manageUserEvents = function(datas)
	{
		playersNumber = datas.playersNumber;
		console.log("Hey !");
	}
	var manageHand = function(datas)
	{
		console.log(game.hand);
		game.hand = datas.hand;
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
}