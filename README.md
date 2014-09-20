NerfBotFighter
==============

NeftBotFighter is a simple Hangout bot for Epitech's nerf battles.
A random time battle is set at startup. When battle starts, a notification with the battle time remaining is sent.
After the battle, a new random time battle is set.

How to use:
  npm install
  node mainbot.js hangoutUsername hangoutPassword pathToRegisteredPlayers timeOfBattle

Available commands from hangout:
  -!nextbattle
      Returns next battle time.
  -!joinfight
      Set yourself into notification list.
  -!leavefight
      Remove yourself from notification list.

Available commands from prompt:
  -save (save all player registered)

TODO:
  .Auto save
  .TimeZone usage
  .fix prompt command "fight"
