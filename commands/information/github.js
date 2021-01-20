const { MessageEmbed } = require("discord.js");
const { createLog } = require("../../functions.js");

module.exports = {
    name: "github",
    aliases: ["git"],
    category: "information",
    description: "Liens vers la page github de NetBot.",
    run: async(client, message, args, command) => {
        const githubEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Hey ${message.member.displayName} ! Tu t'intéresses à ma création ?`)
            .setURL('https://github.com/kriiox/NetBot')
            .setDescription("Je possède une page github ! \nSi tu as des compétences qui permettraient de m'aider à me développer, n'hésite pas à proposer tes idées !")
            .addField('Liens vers github', 'https://github.com/kriiox/NetBot', true)
            .setTimestamp()
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())

        message.channel.send(githubEmbed);
    }
}