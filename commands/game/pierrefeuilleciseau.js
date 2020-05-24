const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "pierrefeuilleciseau",
    aliases: ["pfc"],
    category: "game",
    description: "C'est un Pierre, Feuille, Ciseaux. Je vais pas t'expliquer les règles.",
    usage: "pfc",
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
            .setColor("#ffffff")
            .setTitle(`${message.member.displayName} veut affronter ${message.guild.me.displayName} au Pierre/Feuille/Ciseau`)
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
            .setDescription("Sélectionne un emoji pour commencer à jouer.")
            .setTimestamp();

        const m = await message.channel.send(embed);
        // Wait for a reaction to be added
        const reacted = await promptMessage(m, message.author, 30, chooseArr);
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(`[pfc] ${message.member.displayName}: Succès ! (channel: "${message.channel.name}" à ${time})`);

        // Get a random emoji from the array
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        // Check if it's a win/tie/loss
        const result = await getResult(reacted, botChoice);
        console.log(result);
        // Clear the reactions
        await m.reactions.removeAll();

        embed
            .setDescription("")
            .addField(`${reacted} vs ${botChoice}`, result);

        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                return `Victoire de ${message.member.displayName}`;
            } else if (me === clientChosen) {
                return "Egalité !";
            } else {
                return `Victoire de ${message.guild.me.displayName}`;
            }
        }
    }
}