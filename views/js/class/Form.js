var Form = function(socket)
{
	var container = document.getElementsByTagName("section")[0];
	var canvas = container.getElementsByTagName("canvas")[0];
	var form = container.getElementsByTagName("form")[0];
	var inputs = form.getElementsByTagName("input");
	var button = form.getElementsByTagName("button")[0];
	var errorText = document.getElementById("loginError");
	var url = window.location.href;

	container.removeChild(canvas);
	var sendLoginInfos = function()
	{
		const URL_SEPARATOR = "room/";
		var output = {};
		var index = url.indexOf(URL_SEPARATOR) + URL_SEPARATOR.length;

		output.pseudo = inputs[0].value;
		output.password = inputs[1].value;
		output.roomName = url.substr(index, url.length);
		socket.emit("Login:send_infos", output);
	}
	var getLoginStatus = function(datas)
	{
		if (!datas.valid) {
			errorText.textContent = datas.message;
			return;
		}
		container.removeChild(errorText);
		container.removeChild(form);
		container.appendChild(canvas);
	}
	button.addEventListener("click", sendLoginInfos);
	socket.on("Login:send_status", getLoginStatus);
}