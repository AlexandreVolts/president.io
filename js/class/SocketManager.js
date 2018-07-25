let socketio = require("socket.io");

var SocketManager = function(server, game)
{
	let io;
	
	io = socketio(server);
	io.on("connection", function(socket)
	{
		socket.on("Login:send_infos", function(datas)
		{
			getLoginInfos(datas, socket);
		});
		socket.on("disconnect", function()
		{
			onDisconnect(socket);
		});
	});

	var getLoginInfos = function(datas, socket)
	{
		let password = datas.password.length > 1 ? datas.password : undefined;
		let room = game.getRoom(datas.roomName);
		let output = {valid: false};

		if (room == undefined)
			output.message = "Room doesn't exists.";
		else if (datas.pseudo.length < 2 || datas.pseudo.length > 20)
			output.message = "Invalid username length.";
		else if (password !== room.getPassword())
			output.message = "Invalid password.";
		else {
			output.valid = true;
			socket.pseudo = datas.pseudo;
			console.log("User " + socket.pseudo + " has join the room " + room.name + ".");
			room.addUser(socket);
		}
		socket.emit("Login:send_status", output);
	}
	var onDisconnect = function(socket)
	{
		let name = 
		console.log("User " + (socket.pseudo || socket.id) + " has disconnected.");
	}
}
module.exports = SocketManager;