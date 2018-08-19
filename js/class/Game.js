const Room = require("./Room.js");

var Game = function()
{
	let rooms = [];

	this.addRoom = function(params)
	{
		let roomNamePattern = /[^a-zA-Z\d]/;
		let name = params.name.length > 1 ? params.name : undefined;
		let password = params.password.length > 1 ? params.password : undefined;
		let index;

		if (roomNamePattern.test(params.name))
			return (false);
		index = rooms.findIndex(function(room)
		{
			return (room.name === params.name);
		});
		
		if (index == -1 && name != undefined) {
			rooms.push(new Room(params.name, password));
			console.log("A new room named " + name + " has been created");
			return (true);
		}
		return (false);
	}
	this.removeRoom = function(name)
	{
		var index;

		index = rooms.findIndex(function(room)
		{
			return (room.name === name);
		});
		rooms.splice(index, 1);
	}
	this.getRoom = function(name)
	{
		let output = rooms.find(function(room)
		{
			return (room.name === name);
		});
		
		return (output);
	}
}
module.exports = Game;