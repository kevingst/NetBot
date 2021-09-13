const { MessageEmbed } = require("discord.js");
const { createLog } = require("../../functions.js");

const playerVote = [];

module.exports = {
    name: "vote",
    aliases: ["v"],
    category: "outil",
    description: "Créer un vote Oui/Non/peut-etre.",
    usage: "<question ?> <;10>",
    run: async (client, message, args, command) => {
        if (!message.content.includes("?")) return message.reply(`T'es sur que c'est une question ? Il ne manquerait pas un "?" par hasard...`)

        var question = args.join(" ").split("?")[0];
        var time = args.join(" ").split(";")[1];
        console.log(time);
        if (time == null) {
            time = 1;
        }

        createLog(command, message.member, message.channel, question);
        var msg = message;
        var emojiList = ['👍', '👎', '🤷'];
        var embed = new MessageEmbed()
            .setTitle(question + "?")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter(`Le vote a demarré vous avez ${time} minute(s) pour voter !`);


        msg.delete(); // Remove the user's command message

        msg.channel.send({ embed }) // Use a 2d array?
            .then(async function (message) {
                var reactionArray = [];
                reactionArray[0] = await message.react(emojiList[0]);
                reactionArray[1] = await message.react(emojiList[1]);
                reactionArray[2] = await message.react(emojiList[2]);

                if (time) {
                    setTimeout(() => {
                        // Re-fetch the message and get reaction counts
                        message.channel.messages.fetch(message.id)
                            .then(async function (message) {
                                var reactionCountsArray = [];
                                for (var i = 0; i < reactionArray.length; i++) {
                                    reactionCountsArray[i] = message.reactions.cache.get(emojiList[i]).count - 1;
                                    console.log(reactionCountsArray);
                                }

                                // Find winner(s)
                                var max = -Infinity,
                                    indexMax = [];
                                for (var i = 0; i < reactionCountsArray.length; ++i)
                                    if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                                    else if (reactionCountsArray[i] === max) indexMax.push(i);

                                // Display winner(s)
                                var winnersText = "";
                                if (reactionCountsArray[indexMax[0]] == 0) {
                                    winnersText = "Personne n'a voté !"
                                } else {
                                    for (var i = 0; i < indexMax.length; i++) {
                                        winnersText +=
                                            emojiList[indexMax[i]] + " (" + reactionCountsArray[indexMax[i]] + " vote(s))\n";
                                    }
                                }
                                embed.addField("**Majorité:**", winnersText);
                                embed.setFooter(`Le vote est terminé !`);
                                embed.setTimestamp();
                                message.edit("", embed);
                                createLog(command, message.member, message.channel, reactionCountsArray);
                            });
                    }, time * 60 * 1000);
                }
            }).catch(console.error);
    }
}