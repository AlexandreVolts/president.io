var Chat = function()
{
	var container = document.getElementById("chat");
	var textBox = document.getElementById("textBox");

	window.addEventListener("resize", function()
	{
		container.style.height = window.innerHeight + "px";
	});
	this.writeMessage = function(pseudo, message)
	{
		var p = document.createElement("p");

		p.innerHTML = "<strong>" + pseudo + "</strong> ";
		p.innerHTML += message;
		textBox.appendChild(p);
		textBox.scrollTop = textBox.scrollHeight;
	}
}