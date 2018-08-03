function exportLib(callback, id = 0)
{
	var modules = ["Drawable", "Button", "Vector2D", 
					"Clock", "Sound", "Tileset"];
	var script;

	script = document.createElement("script");
	script.async = true;
	script.type = "text/javascript";
	script.src = "/js/lib/" + modules[id] + ".js"; 
	document.head.appendChild(script);
	if (id < modules.length - 1) {
		script.onload = function()
		{
			exportLib(callback, id + 1);
		};
	}
	else
		script.onload = callback;
}