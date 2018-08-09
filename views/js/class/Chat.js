var Chat = function()
{
	var container = document.getElementById("chat");
	var textBox = document.getElementById("textBox");
	var chatHeader = document.getElementById("chatHeader");
	var users = [];
	
	var resize = function()
	{
		container.style.height = window.innerHeight + "px";
		textBox.style.height = (window.innerHeight - chatHeader.offsetHeight) + "px";
	}
	this.addUser = function(pseudo)
	{
		users.push(new UserBox(chatHeader, pseudo));
		resize();
	}
	this.removeUser = function(index)
	{
		users[index].destroy();
		users.splice(index, 1);
		resize();
	}
	this.writeMessage = function(pseudo, message)
	{
		var p = document.createElement("p");

		p.innerHTML = "<strong>" + pseudo + "</strong> ";
		p.innerHTML += message;
		textBox.appendChild(p);
		textBox.scrollTop = textBox.scrollHeight;
	}
	window.addEventListener("resize", resize);
}