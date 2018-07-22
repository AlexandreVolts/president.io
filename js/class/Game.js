let Room = require("./Room.js");

var Game = function()
{
	let rooms = [];

	this.addRoom = function(params)
	{
		let name = params.name.length > 1 ? params.name : undefined;
		let password = params.password.length > 1 ? params.password : undefined;
		let index = rooms.findIndex(function(element)
		{
			return (element.name === params.name);
		});
		
		if (index == -1 && name != undefined) {
			rooms.push(new Room(params.name, password));
			console.log("A new room named " + name + " has been created");
			return (true);
		}
		return (false);
	}
}
module.exports = Game;