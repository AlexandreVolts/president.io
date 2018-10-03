var MusicPlayer = function(id)
{
	var self = this;
	var soundStorage = [];
	var sound;
	var volumeController = document.getElementById(id);

	volumeController.value = window.localStorage.getItem(id) || 100;
	volumeController.addEventListener("change", function(event)
	{
		if (sound != undefined) {
			sound.setVolume(event.target.value / 100);
			window.localStorage.setItem(id, event.target.value);
		}
	});
	this.change = function(src)
	{
		if (sound != undefined)
			sound.stop();
		sound = soundStorage.find(function(soundObj)
		{
			return (soundObj.src === src);
		});
		if (sound == undefined) {
			sound = new Sound(src);
			soundStorage.push({});
			soundStorage[soundStorage.length - 1].src = src;
			soundStorage[soundStorage.length - 1].sound = sound;
		}
		else
			sound = sound.sound;
		sound.setVolume(volumeController.value / 100);
		sound.play();
	}
	this.rand = function(folder, srcArray)
	{
		var choosenSound = srcArray[~~(Math.random() * srcArray.length)];

		self.change(folder + choosenSound);
	}
}