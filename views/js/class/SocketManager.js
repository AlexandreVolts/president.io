var SocketManager = function(socket, game)
{
	var playersNumber = 0;
	
	socket.on("Room:join", manageUserEvents);
	socket.on("Room:leave", manageUserEvents);

	var manageUserEvents = function(datas)
	{
		playersNumber = datas.playersNumber;
	}
	
	this.getPlayersNumber = function()
	{
		return (playersNumber);
	}
}