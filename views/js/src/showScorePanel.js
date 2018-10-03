var scorePanel = document.getElementById("scorePanel");

function sortDatas(datas)
{
	var playerMin;
	var index;
	var output = [];

	for (var i = 0, len = datas.length; i < len; i++) {
		playerMin = datas[0];
		index = 0;
		for (var j = 0, len2 = datas.length; j < len2; j++) {
			if (datas[j].score < playerMin.score) {
				playerMin = datas[j];
				index = j;
			}
		}
		output.push(playerMin);
		datas.splice(index, 1);
	}
	return (output);
}
function showScorePanel(datas = undefined)
{
	var container = document.getElementsByTagName("section")[0];
	var inner;
	var pseudo;
	var score;
	var pos;

	if (container.contains(scorePanel))
		container.removeChild(scorePanel);
	scorePanel.innerHTML = "";
	if (datas == undefined)
		return;
	datas = sortDatas(datas);
	for (var i = datas.length - 1; i >= 0; i--) {
		inner = document.createElement("div");
		pseudo = document.createElement("h3");
		score = document.createElement("h4");
		pseudo.innerHTML = datas[i].pseudo;
		score.textContent = datas[i].score + " pts";
		inner.style.color = "rgb(255, " + ~~(255 * (i / (datas.length - 1))) + ", 0)";
		inner.appendChild(pseudo);
		inner.appendChild(score);
		scorePanel.appendChild(inner);
	}
	pos = ((window.innerWidth * 0.8 - scorePanel.offsetWidth) / 2) / window.innerWidth;
	scorePanel.style.left = (pos * 100) + "%";
	container.appendChild(scorePanel);
}