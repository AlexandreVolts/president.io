var Sound = function(src)
{
	var sound = document.createElement("audio");

	sound.src = src;
	sound.setAttribute("preload", "auto");
	sound.setAttribute("controls", "none");
	sound.style.display = "none";
	document.body.appendChild(sound);

	this.play = function()
	{
		sound.play();
	}
	this.stop = function()
	{
		sound.pause();
		sound.currentTime = 0;
	}
}