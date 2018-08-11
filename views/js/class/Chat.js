var Chat = function()
{
	var self = this;
	var container = document.getElementById("chat");
	var textBox = document.getElementById("textBox");
	var chatHeader = document.getElementById("chatHeader");
	var users = [];
	
	var resize = function()
	{
		container.style.height = window.innerHeight + "px";
		textBox.style.height = (window.innerHeight - chatHeader.offsetHeight) + "px";
	}
	this.addUser = function(pseudo, score = 0)
	{
		users.push(new UserBox(chatHeader, pseudo));
		self.updateScore(users.length - 1, score);
		resize();
	}
	this.updateScore = function(index, score)
	{
		users[index].update(score);
	}
	this.removeUser = function(index)
	{
		if (users[index] == undefined)
			return;
		users[index].destroy();
		users.splice(index, 1);
		resize();
	}
	this.writeMessage = function(pseudo, message, color = "black")
	{
		var p = document.createElement("p");

		p.style.color = color;
		p.innerHTML = "<strong>" + pseudo + "</strong> ";
		p.innerHTML += message;
		textBox.appendChild(p);
		textBox.scrollTop = textBox.scrollHeight;
	}
	window.addEventListener("resize", resize);
}