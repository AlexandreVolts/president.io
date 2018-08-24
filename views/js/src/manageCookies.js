function manageCookies()
{
	var footer = document.getElementsByTagName("footer")[0];
	var container = document.getElementById("cookies");
	var button = container.getElementsByTagName("button")[0];

	button.addEventListener("click", function()
	{
		footer.removeChild(container);
	});
}
manageCookies();