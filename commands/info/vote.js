module.exports = {
    name: "vote",
    aliases: ["v"],
    category: "info",
    description: "Créer un vote Oui/Non.",
    run: async(client, message, args) => {
        if (!args) return message.reply("You must have something to vote for!")
        if (!message.content.includes("?")) return message.reply(`Il manque un "?" dans la question!`)

        message.channel.send(`:ballot_box: ${message.member.displayName} à lancé un vote! Réagis avec l'emoji. :ballot_box: `);

        const agree = `✅`;
        const disagree = `❎`;

        const question = await message.channel.send(args.join(" "));
        await question.react(agree);
        await question.react(disagree);
        console.log(`Vote lancé par ${message.member.displayName}`);

        // Create a reaction collector
        const reactions = await question.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, { time: 15000 });
        message.channel.send(args.join(" ") + `${agree} : ${reactions.get(agree).count-1} | ${disagree} : ${reactions.get(disagree).count - 1}`);
        question.delete();
    }
}