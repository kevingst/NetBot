const { getMember, formatDate, createLog } = require("../../functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "whois",
    aliases: ["who", "user"],
    category: "information",
    description: "Retourne les informations d'un utilisateur",
    usage: "[pseudo | id | mention]",
    run: (client, message, args, command) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Information membre:', stripIndents `**- Nom:** ${member.displayName}
            **- A rejoins le:** ${joined}
            **- Roles:** ${roles}`, true)

        .addField('Information utilisateur:', stripIndents `**- ID:** ${member.user.id}
            **- Pseudo**: ${member.user.username}
            **- Tag**: ${member.user.tag}
            **- Crée le**: ${created}`, true)

        .setTimestamp()

        if (member.user.presence.activities)
            embed.addField('Joue actuellement à', stripIndents `** Nom:** ${member.user.presence.activities}`);

        message.channel.send(embed);
        createLog(command, message.member, message.channel);
    }
}