const { MessageEmbed } = require("discord.js");
const mysql = require('mysql');
const configDB = require("../../config.json");

var con = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.database
});

module.exports = {
    name: "agenda",
    category: "info",
    description: "Visualiser l'agenda de la classe.",
    run: async(client, message, args) => {
        var dateToday = new Date();
        var numWeekNow;
        const valueLundi = [];
        const valueMardi = [];
        const valueMercredi = [];
        const valueJeudi = [];
        const valueVendredi = [];
        con.query("SELECT * FROM agenda", function(err, rows, fields) {
            if (rows != undefined) {
                rows.forEach(function(row) {
                    try {
                        var matiere = row.matiere;
                        var intitule = row.info_devoir;
                        var dateDevoir = new Date(row.date_devoir);
                        var jour = dateDevoir.getDay();
                        numWeekNow = getNumberOfWeek(dateToday);
                        var numWeekDevoir = getNumberOfWeek(dateDevoir);

                        if (dateToday.getDay() == 6 || dateToday.getDay() == 0) {
                            numWeekNow = numWeekNow + 1;
                        }

                        if (numWeekNow == numWeekDevoir) {
                            if (jour == 1) {
                                valueLundi.push(`> [${matiere}] ${intitule}`);
                            }
                            if (jour == 2) {
                                valueMardi.push(`> [${matiere}] ${intitule}`);
                            }
                            if (jour == 3) {
                                valueMercredi.push(`> [${matiere}] ${intitule}`);
                            }
                            if (jour == 4) {
                                valueJeudi.push(`> [${matiere}] ${intitule}`);
                            }
                            if (jour == 5) {
                                valueVendredi.push(`> [${matiere}] ${intitule}`);
                            }
                        }

                    } catch (error) {
                        console.error('Erreur: Envoi du message Discord !');
                        console.error(error);
                    }
                });

                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:date: Agenda de la semaine ${numWeekNow}`)
                    .addFields({ name: '\u200B', value: '\u200B' })
                    .setTimestamp()
                    .setFooter('Hébergé sur le serveur de ThomasM', '');

                embed.addFields({ name: ':regional_indicator_l: | Lundi:', value: valueLundi, inline: false });
                embed.addFields({ name: ':regional_indicator_m: | Mardi:', value: valueMardi, inline: false });
                embed.addFields({ name: ':regional_indicator_m: | Mercredi:', value: valueMercredi, inline: false });
                embed.addFields({ name: ':regional_indicator_j: | Jeudi:', value: valueJeudi, inline: false });
                embed.addFields({ name: ':regional_indicator_v: | Vendredi:', value: valueVendredi, inline: false });

                message.channel.send(embed);
            }
        });
    }
}

function getNumberOfWeek(dt) {
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}