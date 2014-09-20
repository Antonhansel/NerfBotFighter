NerfBotFighter<br />
==============<br />
<br />
NeftBotFighter is a simple Hangout bot for Epitech's nerf battles.<br />
A random time battle is set at startup. When battle starts, a notification with the battle time remaining is sent.<br />
After the battle, a new random time battle is set.<br />
<br />
How to use:<br />
 npm install<br />
 node mainbot.js hangoutUsername hangoutPassword pathToRegisteredPlayers timeOfBattle<br />
<br />
Available commands from hangout:<br />
 -!nextbattle<br />
 Returns next battle time.<br />
 -!joinfight<br />
 Set yourself into notification list.<br />
 -!leavefight<br />
 Remove yourself from notification list.<br />
<br />
Available commands from prompt:<br />
 -save (save all player registered)<br />
<br />
TODO:<br />
 .Auto save<br />
 .TimeZone usage<br />
 .fix prompt command &quot;fight&quot;<br />
