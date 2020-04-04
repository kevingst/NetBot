const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "agenda",
    category: "info",
    description: "Visualiser l'agenda de la classe.",
    run: async(client, message, args) => {
        const exampleEmbed = new MessageEmbed()

        .setColor('#0099ff')
            .setTitle(':date: Agenda du 6 au 10 Avril')
            .addFields({ name: '\u200B', value: '\u200B' })
            .addFields({ name: ':regional_indicator_l: | Lundi:', value: '> [EDM] Devoir partie 1 \n > [ENG] Messagerie instantanné', inline: false })
            .addFields({ name: ':regional_indicator_m: | Mardi:', value: '> [ENG] Messagerie instantanné', inline: false })
            .addFields({ name: ':regional_indicator_m: | Mercredi:', value: '> [EDM] Devoir partie 2 \n > [ENG] Messagerie instantanné', inline: false })
            .addFields({ name: ':regional_indicator_j: | Jeudi:', value: '> [SISR] RDV M.Mouchard 14h30', inline: false })
            .addFields({ name: ':regional_indicator_v: | Vendredi:', value: '> [SISR] RDV M.Mouchard 14h30 \n > [ENG] Messagerie instantanné', inline: false })
            .setTimestamp()
            .setFooter('Hébergé sur le serveur de ThomasM', '');
        message.channel.send(exampleEmbed);
    }
}