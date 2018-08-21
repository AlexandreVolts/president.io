var UserBox = function(container, pseudo)
{
	var inner = document.createElement("div");
	var header = document.createElement("div");
	var title = document.createElement("h3");
	var score = document.createElement("h4");
	var section = document.createElement("div");
	var cardsBack = document.createElement("img");

	cardsBack.src = SYS.IMG_PATH + SYS.CARDS_BACK_NAME;
	header.classList.add("userBox");
	section.classList.add("sectionBox");
	header.appendChild(title);
	header.appendChild(score);
	inner.appendChild(header);
	inner.appendChild(section);
	title.textContent = pseudo + " :";
	score.textContent = "0pts";
	container.appendChild(inner);
	
	this.activate = function(on)
	{
		if (on)
			inner.classList.add("active");
		else
			inner.classList.remove("active");
	}
	this.showCards = function(cardsNbr)
	{
		section.innerHTML = "";
		for (var i = 0; i < cardsNbr; i++)
			section.appendChild(cardsBack.cloneNode(true));
	}
	this.update = function(newScore)
	{
		score.textContent = newScore + " pts";
	}
	this.destroy = function()
	{
		container.removeChild(inner);
	}
}