var fortuneCookies = [
	"Eat my food",
	"Don't eat my food",
	"Consider eating my food",
	"Don't even think about my food",
	"Whenever possible, eat my food"
];

exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
};