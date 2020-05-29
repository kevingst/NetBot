const { createLog } = require("../../functions.js");

module.exports = {
    name: "say",
    aliases: ["dire", "s"],
    category: "moderation",
    description: "Faire parler Netbeans",
    usage: "<message>",
    run: async(client, message, args, command) => {
        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Tu ne peux pas utiliser cette commande...").then(m => m.delete(5000));
        }

        if (message.deletable) message.delete();

        if (args.length < 1)
            return message.reply("Rien à dire ?").then(m => m.delete(5000));

        var msg = args.join(" ")
        message.channel.send(msg);
        createLog(command, message.member, message.channel, msg);
    }
}