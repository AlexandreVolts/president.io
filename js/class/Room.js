var Room = function(name, password = undefined)
{
	const PASSWORD = password;
	let self = this;
	let users = [];
	this.name = name;

	this.addUser = function(socket)
	{
		users.push(socket);
	}
	this.getPassword = function()
	{
		return (PASSWORD);
	}
}
module.exports = Room;