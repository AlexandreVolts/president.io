var Form = function(socket, chat)
{
	var header = document.getElementsByTagName("header")[0];
	var section = document.getElementsByTagName("section")[0];
	var canvas = section.getElementsByTagName("canvas")[0];
	var form = header.getElementsByTagName("form")[0];
	var inputs = form.getElementsByTagName("input");
	var button = form.getElementsByTagName("button")[0];
	var errorText = document.getElementById("loginError");
	var chatContainer = document.getElementById("chat");
	var url = window.location.href;

	section.removeChild(canvas);
	section.removeChild(chatContainer);
	var sendLoginInfos = function()
	{
		const URL_SEPARATOR = "room/";
		var output = {};
		var index = url.indexOf(URL_SEPARATOR) + URL_SEPARATOR.length;

		output.pseudo = inputs[0].value;
		output.password = inputs[1].value;
		output.roomName = url.substr(index, url.length);
		document.title = output.roomName + " - president.io";
		socket.emit("Login:send_infos", output);
	}
	var getLoginStatus = function(datas)
	{
		if (!datas.valid) {
			errorText.textContent = datas.message;
			return;
		}
		document.body.removeChild(header);
		section.appendChild(chatContainer);
		section.appendChild(canvas);
		datas.players.forEach(function(player)
		{
			chat.addUser(player.pseudo, player.score);
		});
		socket.index = datas.players.length;
	}
	button.addEventListener("click", sendLoginInfos);
	socket.on("Login:send_status", getLoginStatus);
}