const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { createLog } = require("../../functions.js");
const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "information",
    description: "Afficher le profil instagram à partir du pseudo",
    usage: "<nom>",
    run: async(client, message, args, command) => {
        const name = args.join(" ");

        if (!name) {
            return message.reply("Il serait plus utile de rechercher quelqu'un...")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;

        let res;

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {            
            return message.reply("Je n'ai pas trouvé cet utilisateur...")
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;

        const embed = new MessageEmbed()
            .setColor("PURPLE")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Information du profil", stripIndents `**- Pseudo:** ${account.username}
            **- Nom complet:** ${account.full_name}
            **- Biographie:**\n ${account.biography.length == 0 ? "none" : account.biography}
            **- Publications:** ${account.edge_owner_to_timeline_media.count}
            **- Abonnés:** ${account.edge_followed_by.count}
            **- Abonnements:** ${account.edge_follow.count}
            **- Compte privé:** ${account.is_private ? "Oui 🔐" : "Non 🔓"}`);

        message.channel.send(embed);
        createLog(command, message.member, message.channel, url);
    }
}