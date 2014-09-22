var hangoutsBot = require("hangouts-bot");
var bot = new hangoutsBot(process.argv[2], process.argv[3]);
var Chance = require('chance'), chance = new Chance();
var express = require('express');
var app = express();
app.listen(process.env.PORT || 5000);
console.log("API now listening on port " + process.env.PORT);

var messageToSend;
var fightTime = process.argv[5];
var players = [];
var fs = require('fs');
var readLine = require('readline');

var pin = require('pin');
pin('http://nerf-bot.herokuapp.com/update')
.interval(500000)
.up(function(response) {
	console.log("Website pinged!");
})
.down(function(error, response) {
	console.log(error, "Website pinged!");
});

var playerList;
var numPlayers = 0;

var processLine = function(line)
{
	if (line == "save")
	{
		numPlayers = 0;
		playerList = "";
		fs.truncate(process.argv[4], 0, function(){console.log('Done truncating file!')
			for (var i = 0; i < players.length; i++)
			{
				playerList += players[i] + "\n";
				console.log("Adding player: " + players[i]);
				numPlayers++;
			}
			fs.appendFile("./playerList.txt", playerList, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log(numPlayers + " players were added to file!");
				}
			});
			setTimeout(function(){processLine(line)}, 5 * 60000);
		});
	}
	else if (line.indexOf("fight") > -1)
	{
		console.log("Next fight in " + line.match(/\d+/)[0]);
		setTimeout(function(){sendFight()}, (line.match(/\d+/)[0] * 60000));	
	}
}

var rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

setTimeout(function(){processLine("save")}, 5 * 60000);

rl.on('line', function(line){
	processLine(line);
})

var getFightTime = function()
{
	return (chance.minute() + chance.minute()) * 4;
}

var time = getFightTime();
var date = new Date();
var newDateObj = new Date(date.getTime() + (time + 120) *60000);
messageToSend = "Next battle at " + newDateObj + " :)!";
setTimeout(function(){sendFight()}, (time * 60000));

function addToArray(data)
{
	console.log(data + " added to player list");
	players.push(data);
}

function readLines(input, func) {
	var remaining = '';

	input.on('data', function(data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		var last  = 0;
		while (index > -1) {
			var line = remaining.substring(last, index);
			last = index + 1;
			func(line);
			index = remaining.indexOf('\n', last);
		}

		remaining = remaining.substring(last);
	});

	input.on('end', function() {
		if (remaining.length > 0) {
			func(remaining);
		}
	});
}

(function initFile()
{

	console.log("Processing " + process.argv[4] + " for player list: ")
	var input = fs.createReadStream(process.argv[4]);
	readLines(input, addToArray);
})()


bot.on('online', function() {
	console.log('Made by antoninribeaud@gmail.com.\nBot is now online :)!\nNext fight in ' + time + ' minutes);');
});

var endFight = function()
{
	time = getFightTime();
	date = new Date();
	newDateObj = new Date(date.getTime() + (time + 120) *60000);
	setTimeout(function(){sendFight()}, (time * 60000));	
	messageToSend = "Next battle at " + newDateObj + " :)!";
console.log("STOP FIGHTING, NOW! Next fight in " + time + " minutes");
for (var i = 0; i < players.length; i++)
{
	bot.sendMessage(players[i], "SPOT FIGHTING YOU PIECE OF GARBARGE! NEXT FIGHT IN " + time + " MINUTES");
}
}

var sendFight = function()
{
	time = fightTime;
	messageToSend = "BATTLE IN PROGRESS!";
	setTimeout(function(){endFight()}, (time * 60000));
	console.log("FIGHT STARTED, " + time + " minutes left");
	for (var i = 0; i < players.length; i++)
	{
		bot.sendMessage(players[i], "FIGHT STARTED MOTHERFUCKER! END OF FIGHT IN " + time + " MINUTES");
	}
}

var isHere = 0;
var arrayIndex = -1;

bot.on('message', function(from, message) 
{
	console.log(from + " >> " + message);
	if (message.indexOf("!joinfight") > -1)
	{
		isHere = 0;
		for (var i = 0; i < players.length; i++)
		{
			if (players[i].indexOf(from) > -1)
				isHere = 1;
		}
		if (isHere == 1)
		{
			console.log("Player already registered");
			bot.sendMessage(from, "You are already registered!");
		}
		else
		{
			players.push(from);
			console.log("New fighter joined the game!");
			bot.sendMessage(from, "You have joined the game, you will be notified of the next fight!");
		}
	}
	else if (message.indexOf("!nextbattle") > -1)
	{
		console.log("Someone asked for the next battle time");
		bot.sendMessage(from, "Next battle at " + newDateObj + " :)!");
	}
	else if (message.indexOf("!leavefight") > -1)
	{
		console.log("Someone want's to leave the fight");
		for (var i = 0; i < players.length; i++)
		{
			if (players[i].indexOf(from) > -1)
			{
				players.splice(i, 1);
				console.log("Player removed");
			}
		}
		bot.sendMessage(from, "You have been removed from the notification list!");
	}
	else if (from == "1euiiawih7n212ri51i6itl2r7@public.talk.google.com/AChromeExtensionwB5E21170")
	{
		if (message.indexOf("!playerlist") > -1)
		{
			for (var i = 0; i < players.length; i++)
			{
			 	bot.sendMessage(from, players[i]);
			}
		}
		else if (message.indexOf("!addplayer") > -1)
		{
			
		}
	}
	else
	{
		console.log("Unrecognized message");
		bot.sendMessage(from, 'Unrecognized message, available commands are:\n!nextbattle - show time until next battle\n!joinfight - be notified for the next fight\n!leavefight - quit fight notifications\nA question? A bug? Email antoninribeaud@gmail.com');
	}
});

app.get('/update', function(req, res)
{
	res.send(messageToSend);
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
