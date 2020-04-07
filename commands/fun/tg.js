const { getMember } = require("../../functions.js");

module.exports = {
    name: "tagueule",
    aliases: ["tg"],
    category: "fun",
    description: "Bloquer les communications des tocards.",
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