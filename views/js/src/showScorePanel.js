var scorePanel = document.getElementById("scorePanel");

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
	for (var i = datas.length - 1; i >= 0; i--) {
		inner = document.createElement("div");
		pseudo = document.createElement("h3");
		score = document.createElement("h4");
		pseudo.textContent = datas[i].pseudo;
		score.textContent = datas[i].score + " pts";
		inner.style.color = "rgb(255, " + Math.floor(255 * (i / (datas.length - 1))) + ", 0)";
		inner.appendChild(pseudo);
		inner.appendChild(score);
		scorePanel.appendChild(inner);
	}
	pos = ((window.innerWidth * 0.8 - scorePanel.offsetWidth) / 2) / window.innerWidth;
	scorePanel.style.left = (pos * 100) + "%";
	container.appendChild(scorePanel);
}