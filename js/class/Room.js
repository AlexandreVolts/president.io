const Deck = require("./Deck.js");

var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let users = [];
	let deck = new Deck();
	
	this.name = name;

	deck.generate();
	deck.shuffle(0.74);
	
	this.broadcast = function(event, datas)
	{
		users.forEach(function(socket)
		{
			socket.emit(event, datas);
		});
	}
	this.addUser = function(socket)
	{
		let output = {pseudo: socket.pseudo};
		
		users.push(socket);
		output.playersNumber = users.length;
		self.broadcast("Room:join", output);
		console.log("User " + socket.pseudo + " has join the room " + self.name + ".");
	}
	this.removeUser = function(socket)
	{
		let index = users.indexOf(socket);
		let output = {pseudo: socket.pseudo};

		users.splice(index, 1);
		output.playersNumber = users.length;
		self.broadcast("Roome:leave", output);
		console.log("User " + socket.pseudo + " leaved the room " + self.name + ".");
	}
	this.getPassword = function()
	{
		return (PASSWORD);
	}
}
module.exports = Room;