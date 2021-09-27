// INIT PR
const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");
const { createLog } = require("../../functions.js");
const timerlib = require('easytimer.js').Timer;

const reactPlayer = ['↖️', '⬆️', '↗️', '⬅️', '⏺️', '➡️', '↙️', '⬇️', '↘️'];
var gameBoard = [
  ['⬜', '⬜', '⬜'],
  ['⬜', '⬜', '⬜'],
  ['⬜', '⬜', '⬜'],
];
const timeToPlay = 6
var isPlayerTurn = true;

module.exports = {
  name: "ttt",
  category: "game",
  description: "Celebre jeu du tic tac toe.",
  run: async (client, message, args, command) => {

    const boardMsg = await message.channel.send(printBoard());
    const turnMsg = await message.channel.send(`A ton tour de jouer ! (${timeToPlay})`);
    for (const reaction of reactPlayer) await turnMsg.react(reaction);

    checkEndTurn(boardMsg, turnMsg, message);
  }
}

function playerTurn(boardMsg, turnMsg, message) {
  var filter = (reaction, user) => reactPlayer.includes(reaction.emoji.name) && user.id === message.author.id;
  var collector = turnMsg.createReactionCollector(filter, { time: timeToPlay * 1000 });
  updateTimer(turnMsg);
  collector.on('collect', r => {
    boardMsg.edit(printBoard(r));
    console.log(`Collected ${r.emoji.name}`)
  });
  collector.on('end', collected => {
    isPlayerTurn = false;
    checkEndTurn(boardMsg, turnMsg, message);
    console.log(`Collected ${collected.size} items`);
    collector.stop();
  });

};

function botTurn(boardMsg, turnMsg, message) {
  let botPos = getEmoji((Math.floor(Math.random() * 9) + 1));
  console.log("RandomPos: " + botPos);
  let output = '';
  let index = 1;
  let indexRow = 0;
  for (let row of gameBoard) {
    let indexCell = 0;
    for (let cell of row) {
      if (botPos == getEmoji(index)) {
        if (cell == '⬜') {
          gameBoard[indexRow][indexCell] = '🅾️';
          output += '🅾️';
        } else {
          //botTurn(boardMsg, turnMsg, message);
        }
      } else {
        output += cell;
      }
      index++;
      indexCell++;
    }
    indexRow++;
    output += '\n';
  }
  boardMsg.edit(output);
  isPlayerTurn = true;
  checkEndTurn(boardMsg, turnMsg, message);
}

function updateTimer(timeMessage) {
  let timer = new timerlib();
  timer.start({ countdown: true, startValues: { seconds: timeToPlay } });
  timer.on('secondsUpdated', function (e) {
    timeMessage.edit(`A ton tour de jouer ! (${timer.getTimeValues().seconds})`);
  });
}

function checkEndTurn(boardMsg, turnMsg, message) {
  console.log(isPlayerTurn);
  if (isPlayerTurn == true) {
    playerTurn(boardMsg, turnMsg, message);
  } else {
    botTurn(boardMsg, turnMsg, message);
  }
}

function printBoard(position) {
  let output = '';
  let index = 1;
  let indexRow = 0;
  for (let row of gameBoard) {
    let indexCell = 0;
    for (let cell of row) {
      if (position != null && position.emoji.name == getEmoji(index)) {
        gameBoard[indexRow][indexCell] = '🇽';
        output += '🇽';
      } else {
        output += cell;
      }
      index++;
      indexCell++;
    }
    indexRow++;
    output += '\n';
  }
  return output;
}

function getEmoji(number) {
  switch (number) {
    case 1:
      return '↖️';
    case 2:
      return '⬆️';
    case 3:
      return '↗️';
    case 4:
      return '⬅️';
    case 5:
      return '⏺️';
    case 6:
      return '➡️';
    case 7:
      return '↙️';
    case 8:
      return '⬇️';
    case 9:
      return '↘️';
  }
}