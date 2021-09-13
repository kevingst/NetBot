const { MessageEmbed } = require("discord.js");
const { createLog } = require("../../functions.js");

const playerVote = [];

module.exports = {
    name: "sondage",
    aliases: ["poll"],
    category: "outil",
    description: "Créer un sondage (Maximum 10 options).",
    usage: "<question ?> <option1,option2,...> <;10>",
    run: async (client, message, args, command) => {
        if (!message.content.includes("?")) return message.reply(`T'es sur que c'est une question ? Il ne manquerait pas un "?" par hasard...`)

        var question = args.join(" ").split("?")[0];
        var optionsList = args.join(" ").split("?")[1].split(";")[0].split(",");
        var time = args.join(" ").split("?")[1].split(";")[1];
        if (time == null) {
            time = 0.3;
        }

        createLog(command, message.member, message.channel, question);
        var msg = message;
        var emojiList = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

        var optionsText = "";
        for (var i = 0; i < optionsList.length; i++) {
            optionsText += emojiList[i] + " " + optionsList[i] + "\n";
        }

        var embed = new MessageEmbed()
            .setTitle(question + "?")
            .setDescription(optionsText)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter(`Le vote a demarré vous avez ${time} minute(s) pour voter !`);


        msg.delete(); // Remove the user's command message

        msg.channel.send({ embed }) // Use a 2d array?
            .then(async function (message) {
                var reactionArray = [];
                for (var i = 0; i < optionsList.length; i++) {
                    reactionArray[i] = await message.react(emojiList[i]);
                }

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