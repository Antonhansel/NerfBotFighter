var hangoutsBot = require("hangouts-bot");
var bot = new hangoutsBot(process.argv[2], process.argv[3]);
var Chance = require('chance'),
    chance = new Chance();

var time = chance.minute() + chance.minute();
console.log("Next fight in " + time + " minutes");
bot.on('online', function() {
	console.log('Bot is now online');
    });


setTimeout()
bot.on('message', function(from, message) {
	if (message.indexOf("!joinfight") > -1)
	{
		console.log("fight joined");
	}
	console.log(from + ">> " + message);
    });
