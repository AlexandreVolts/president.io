let Chat = function(socket)
{
	let self = this;
	let container = document.getElementById("chat");
	let textBox = document.getElementById("textBox");
	let chatHeader = document.getElementById("chatHeader");
	let chatInput = document.getElementById("chatInput");
	let visualText = document.createElement("h2");
	let users = [];
	let id = 0;
	
	visualText.id = "visualText";
	container.appendChild(visualText);
	let sendMessage = function(event)
	{
		if (event.key == "Enter" || event.code == "Enter" || event.which == 13) {
			if (chatInput.value.length >= 2) {
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
		if (newID >= 0 && newID < users.length)
			users[newID].activate(true);
		id = newID;
	}
	this.writeMessage = function(pseudo, message, color = "white")
	{
		let p = document.createElement("p");
		let content = "<strong>" + pseudo + "</strong> " + message;

		p.style.color = color;
		p.innerHTML = content;
		textBox.appendChild(p);
		textBox.scrollTop = textBox.scrollHeight;
		container.removeChild(visualText);
		visualText.style.color = color;
		visualText.innerHTML = content;
		container.appendChild(visualText);
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