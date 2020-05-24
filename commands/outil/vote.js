const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "vote",
    aliases: ["v"],
    category: "outil",
    description: "Créer un vote Oui/Non/peut-etre.",
    usage: "<question>",
    run: async(client, message, args) => {
        if (!message.content.includes("?")) return message.reply(`T'es sur que c'est une question ? Il ne manquerait pas un "?" par hasard...`)

        var question = args.join(" ");
        console.log(`-> Vote lancé par ${message.member.displayName}: ${question}`);
        var time = 1 / 5;
        var msg = message;
        var emojiList = ['👍', '👎', '🤷'];
        var embed = new MessageEmbed()
            .setTitle(question)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setColor(0x00AE86)
            .setTimestamp();

        if (time) {
            embed.setFooter(`Le vote a demarré vous avez ${time} minute(s)`)
        } else {
            embed.setFooter(`Le vote a demarré, pas de temps défini`)
        }

        msg.delete(); // Remove the user's command message

        msg.channel.send({ embed }) // Use a 2d array?
            .then(async function(message) {
                var reactionArray = [];
                reactionArray[0] = await message.react(emojiList[0]);
                reactionArray[1] = await message.react(emojiList[1]);
                reactionArray[2] = await message.react(emojiList[2]);

                if (time) {
                    setTimeout(() => {
                        // Re-fetch the message and get reaction counts
                        message.channel.messages.fetch(message.id)
                            .then(async function(message) {
                                var reactionCountsArray = [];
                                for (var i = 0; i < reactionArray.length; i++) {
                                    reactionCountsArray[i] = message.reactions.cache.get(emojiList[i]).count - 1;
                                }

                                // Find winner(s)
                                var max = -Infinity,
                                    indexMax = [];
                                for (var i = 0; i < reactionCountsArray.length; ++i)
                                    if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                                    else if (reactionCountsArray[i] === max) indexMax.push(i);

                                // Display winner(s)
                                console.log(reactionCountsArray); // Debugging votes
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
                            });
                    }, time * 60 * 1000);
                }
            }).catch(console.error);
    }
}