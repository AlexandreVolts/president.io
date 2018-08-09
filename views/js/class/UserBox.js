var UserBox = function(container, pseudo)
{
	var inner = document.createElement("div");
	var header = document.createElement("div");
	var title = document.createElement("h3");
	var score = document.createElement("h4");

	header.classList.add("userBox");
	header.appendChild(title);
	header.appendChild(score);
	inner.appendChild(header);
	title.textContent = pseudo + " :";
	score.textContent = "0pts";
	container.appendChild(inner);
	
	this.update = function(newScore)
	{
		score.textContent = newScore + "pts";
	}
	this.destroy = function()
	{
		container.removeChild(inner);
	}
}