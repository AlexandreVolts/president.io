const Room = require("./Room.js");

var Game = function()
{
	let rooms = [];

	let isFormFilled = function(params)
	{
		let keys = Object.keys(params);
		
		for (let i = keys.length - 1; i >= 0; i--) {
			if (keys[i] != "password" && params[keys[i]] == "")
				return (false);
		}
		params.min = parseInt(params.min);
		params.max = parseInt(params.max);
		params.rounds = parseInt(params.rounds);
		return (true);
	}
	
	this.addRoom = function(params)
	{
		let roomNamePattern = /[^a-zA-Z\d]/;
		let name;
		let password;
		let index;

		if (!isFormFilled(params))
			return (false);
		name = params.name.length > 1 ? params.name : undefined;
		password = params.password.length > 1 ? params.password : undefined;
		if (params.min > params.max  || params.min < 3 || params.min > 6  || params.max > 8)
			return (false);
		if (params.rounds < 3 || params.rounds > 10)
			return (false);
		if (roomNamePattern.test(params.name))
			return (false);
		index = rooms.findIndex(function(room)
		{
			return (room.name === params.name);
		});
		if (index == -1 && name != undefined) {
			rooms.push(new Room(params.name, password));
			rooms[rooms.length - 1].setBounds(params.min, params.max);
			rooms[rooms.length - 1].roundsNumber = params.rounds;
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
	this.getRandomPublicRoom = function()
	{
		let publicRooms = rooms.filter(function(room)
		{
			return (room.getPassword() == undefined);
		});

		if (publicRooms.length == 0)
			return (undefined);
		return (publicRooms[Math.floor(Math.random() * publicRooms.length)].name);
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