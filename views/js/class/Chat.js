var Chat = function(socket)
{
	var self = this;
	var container = document.getElementById("chat");
	var textBox = document.getElementById("textBox");
	var chatHeader = document.getElementById("chatHeader");
	var chatInput = document.getElementById("chatInput");
	var users = [];
	var id = 0;
	
	var sendMessage = function(event)
	{
		if (event.key == "Enter" || event.code == "Enter" || event.which == 13) {
			if (chatInput.value.length >= 3) {
				socket.emit("Chat:message", {content: chatInput.value});
				chatInput.value = "";
			}
		}
	}

	this.resize = function()
	{
		container.style.height = window.innerHeight + "px";
		textBox.style.height = (window.innerHeight - chatHeader.offsetHeight - chatInput.offsetHeight - 5) + "px";
	}
	this.addUser = function(pseudo, score = 0)
	{
		users.push(new UserBox(chatHeader, pseudo));
		users[users.length - 1].update(score);
		self.resize();
	}
	this.removeUser = function(index)
	{
		if (users[index] == undefined)
			return;
		users[index].destroy();
		users.splice(index, 1);
		self.resize();
	}
	this.activate = function(newID)
	{
		if (newID == undefined)
			return;
		if (users[id] != undefined)
			users[id].activate(false);
		users[newID].activate(true);
		id = newID;
	}
	this.writeMessage = function(pseudo, message, color = "white")
	{
		var p = document.createElement("p");

		p.style.color = color;
		p.innerHTML = "<strong>" + pseudo + "</strong> ";
		p.textContent += message;
		textBox.appendChild(p);
		textBox.scrollTop = textBox.scrollHeight;
	}
	this.writeImportantMessage = function(pseudo, message, color = "white")
	{
		self.addSeparator();
		self.writeMessage(pseudo, message, color);
		self.addSeparator();
	}
	this.addSeparator = function()
	{
		textBox.appendChild(document.createElement("hr"));
	}
	this.getUser = function(id)
	{
		return (users[id]);
	}
	window.addEventListener("resize", self.resize);
	chatInput.addEventListener("keydown", sendMessage);
}