const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");
const { createLog } = require("../../functions.js");

const chooseArr = ["🗻", "📰", "✂"];
var finalResult = "";

module.exports = {
    name: "chifoumi",
    category: "game",
    description: "C'est un Chifumi. Je vais pas t'expliquer les règles.",
    run: async(client, message, args, command) => {
        const embed = new MessageEmbed()
            .setColor("#ffffff")
            .setTitle(`${message.member.displayName} veut affronter ${message.guild.me.displayName} au Chifoumi`)
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
            .setDescription("Sélectionne un emoji pour commencer à jouer.")
            .setTimestamp();

        const m = await message.channel.send(embed);
        // Wait for a reaction to be added
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        // Get a random emoji from the array
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        // Check if it's a win/tie/loss        
        const result = await getResult(reacted, botChoice);
        createLog(command, message.member, message.channel, result);
        // Clear the reactions
        await m.reactions.removeAll();
        
        if(reacted != null){
            finalResult = `${reacted} vs ${botChoice}`;
        } else {
            finalResult = `${message.member.displayName} a abandonné.` 
        }

        embed
            .setDescription("")
            .addField(finalResult, result);

        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰") &&
                (me != null)) {
                return `Victoire de ${message.member.displayName} 🏆`;
            } else if (me === clientChosen) {
                return "Egalité ! 🤝";
            } else {
                return `Victoire de ${message.guild.me.displayName} 🏆`;
            }
        }
    }
}