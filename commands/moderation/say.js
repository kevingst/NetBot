module.exports = {
    name: "say",
    category: "moderation",
    description: "Parler à la place du bot",
    usage: "<input>",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        if (args.length < 1)
            return message.reply("Rien à dire ?").then(m => m.delete(5000));
        message.channel.send(args.join(" "));
    }
}