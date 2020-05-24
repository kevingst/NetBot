const { getMember } = require("../../functions.js");

module.exports = {
    name: "demute",
    category: "moderation",
    description: "Debloquer les communications des tocards.",
    usage: "<pseudo | id | mention>",
    run: async(client, message, args) => {
        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Tu ne peux pas utiliser cette commande...").then(m => m.delete(5000));
        }

        const member = getMember(message, args.join(" "));
        const tocardRole = message.guild.roles.cache.find(role => role.name === 'Tocard');

        if (!member.roles.cache.some(role => role.name === tocardRole.name)) {
            return message.reply(`**${member.displayName}** n'est pas mute.`).then(m => m.delete(5000));
        }

        member.roles.remove(tocardRole.id);
        message.channel.send(`**${member.displayName}** vient d'être demute.`)
    }
}