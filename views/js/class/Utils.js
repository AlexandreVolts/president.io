var Utils = 
{
	getRole: function(place, len)
	{
		let status = "";

		if (place <= len / 2) {
			for (var i = len / 2 - (place - 1); i < len / 2; i++)
				status += "vice-";
			status += "president";
		}
		if (place > len / 2) {
			for (var i = place; i < len; i++)
				status += "vice-";
			status += "looser";
		}
		if (place == len / 2 + 0.5)
			status = "neutral";
		return (status);
	},
	getSuffix: function(place)
	{
		if (place == 1)
			return ("st");
		if (place == 2)
			return ("nd");
		if (place == 3)
			return ("rd");
		return ("th");
	}
};