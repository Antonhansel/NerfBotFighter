var hangoutsBot = require("hangouts-bot");
var bot = new hangoutsBot(process.argv[2], process.argv[3]);
var Chance = require('chance'),
    chance = new Chance();
var players = [];
var fs = require('fs');

var getFightTime = function()
{
	return 0.1;//chance.minute()/4;
}

var time = getFightTime();
var date = new Date();
var newDateObj = new Date(date.getTime() + time *60000);
setTimeout(function(){sendFight()}, (time * 60000));

bot.on('online', function() {
	console.log('Made by antoninribeaud@gmail.com.\nBot is now online :)!\nNext fight in ' + time + ' minutes);');
	});

var endFight = function()
{
	time = getFightTime();
	newDateObj = new Date(date.getTime() + time *60000);
	setTimeout(function(){endFight()}, (time * 60000));	
	console.log("STOP FIGHTING, NOW! Next fight in " + time + " minutes");
	for (var i = 0; i < players.length; i++)
	{
		bot.sendMessage(players[i], "SPOT FIGHTING YOU PIECE OF GARBARGE! NEXT FIGHT IN " + time + " MINUTES");
	}
}

var sendFight = function()
{
	time = 5;
	newDateObj = new Date(date.getTime() + time *60000);
	setTimeout(function(){endFight()}, (time * 60000));
	console.log("FIGHT STARTED, " + time + " minutes left");
	for (var i = 0; i < players.length; i++)
	{
		bot.sendMessage(players[i], "FIGHT STARTED MOTHERFUCKER! END OF FIGHT IN " + time + " MINUTES");
	}
}

bot.on('message', function(from, message) 
{
console.log(from + " >> " + message);
	if (message.indexOf("!joinfight") > -1)
	{
	players.push(from);
		fs.appendFile("playerList.txt", from, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("New player was added!");
	    }
	}); 
		console.log("New fighter joined the game!");
		bot.sendMessage(from, "You have joined the game, you will be notified of the next fight!");
	}
	else if (message.indexOf("!nextbattle") > -1)
	{
		console.log("Someone asked for the next battle time");
		bot.sendMessage(from, "Next battle at " + newDateObj + " :)!");
	}
	else if (message.indexOf("!leavefight") > -1)
	{
		console.log("Someone want's to leave the fight");
		bot.sendMessage(from, "Function not implemented yet. Soz :(");
	}
	else
	{
		console.log("Unrecognized message");
		bot.sendMessage(from, 'Unrecognized message: available commands are:\n!nextbattle - show time until next battle\n!joinfight - be notified for the next fight\n!leavefight - quit fight notifications\nA question? A bug? Email antoninribeaud@gmail.com');
	}
});

function msToTime(s) {

  function addZ(n) {
    return (n<10? '0':'') + n;
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
}