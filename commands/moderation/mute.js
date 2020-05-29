const { getMember, createLog } = require("../../functions.js");

module.exports = {
    name: "mute",
    aliases: ["tg"],
    category: "moderation",
    description: "Bloquer les communications des tocards.",
    usage: "<pseudo | id | mention>",
    run: async(client, message, args, command) => {
        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Tu ne peux pas utiliser cette commande...").then(m => m.delete(5000));
        }

        const member = getMember(message, args.join(" "));
        const tocardRole = message.guild.roles.cache.find(role => role.name === 'Tocard');

        if (member.roles.cache.some(role => role.name === tocardRole.name)) {
            return message.reply(`**${member.displayName}** est déjà mute.`).then(m => m.delete(5000));
        }

        member.roles.add(tocardRole.id);
        message.channel.send(`**${member.displayName}** vient d'être mute.`)
        createLog(command, message.member, message.channel);
    }
}