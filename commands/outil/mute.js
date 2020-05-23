const { getMember } = require("../../functions.js");

module.exports = {
    name: "mute",
    aliases: ["tg"],
    category: "outil",
    description: "Bloquer les communications des tocards.",
    usage: "<pseudo | id | mention>",
    run: async(client, message, args) => {
        const member = getMember(message, args.join(" "));

        const tocardRole = message.guild.roles.cache.find(role => role.name === 'Tocard');
        if (member.roles.cache.some(role => role.name === tocardRole.name)) {
            member.roles.remove(tocardRole.id);
        } else {
            member.roles.add(tocardRole.id);
        }
    }
}