var MusicPlayer = function()
{
	var sound;
	var volumeController = document.getElementById("musicVolume");

	volumeController.value = window.localStorage.getItem("volume") || 100;
	volumeController.addEventListener("change", function(event)
	{
		if (sound != undefined) {
			sound.setVolume(event.target.value / 100);
			window.localStorage.setItem("volume", event.target.value);
		}
	});
	this.changeMusic = function(src)
	{
		if (sound != undefined)
			sound.stop();
		sound = new Sound(SYS.Music.PATH + src);
		sound.setVolume(volumeController.value / 100);
		sound.play();
	}
}