const { MessageEmbed } = require("discord.js");
const mysql = require('mysql');
const configJSON = require("../../config.json");
const { createLog } = require("../../functions.js");

var con = mysql.createConnection({
    host: configJSON.host,
    user: configJSON.user,
    password: configJSON.password,
    database: configJSON.database
});

module.exports = {
    name: "agenda",
    aliases: ["devoir", "a"],
    category: "information",
    description: "Visualiser l'agenda de la classe.",
    usage: "[Num semaine]",
    run: async(client, message, args, command) => {
        var dateToday = new Date();
        var listDevoir = [];

        const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`:date: Agenda`)
                .setTimestamp()
                .setFooter('Agenda', '')

        con.query("SELECT * FROM agenda where date_devoir >= now() ORDER BY date_devoir asc", function(err, rows, fields) {
            if (rows != undefined) {
                rows.forEach(function(row) {
                    try {
                        var matiere = row.matiere;
                        var intitule = row.info_devoir;
                        var dateDevoir = new Date(row.date_devoir);
                        var devoir = `> [:zzz:]`;

                        let dateDevoirFormat = dateDevoir.toLocaleDateString('fr-FR',{
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        });

                        devoir = `> **【**${getEmoji(matiere)}**】** ${intitule}`;
                        embed.addFields({ name: `**${dateDevoirFormat.charAt(0).toUpperCase() + dateDevoirFormat.substring(1).toLowerCase()}**:`, value: devoir, inline: false })
                    } catch (error) {
                        console.error('Erreur: Envoi du message Discord !');
                        console.error(error);
                    }
                });
            }

            if(message.channel.name == "【📅】agenda"){
                message.channel.send(embed);
            } else {
                message.channel.send("Mauvais channel !")
            }
            createLog(command, message.member, message.channel);
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

function getEmoji(matiere){
    var newMatiere;
    switch (matiere) {
        case "System Exp":
            newMatiere = "🌐 System Exp";
            break;
        case "Littérature Qué":
            newMatiere = "📔 Littérature Qué";
            break;
        case "Web Dyn":
            newMatiere = "💻 Web Dyn";
            break;
        case "Concept Web":
            newMatiere = "💻 Concept Web";
            break;
        case "Logiciel Info":
            newMatiere = "💾 Logiciel Info";
            break;
        case "Anglais Nul":
            newMatiere = "👅 Anglais Nul";
            break;
        case "Anglais pas nul":
            newMatiere = "👅 Anglais pas nul";
            break;
        case "Intro Jeu":
            newMatiere = "🎮 Intro Jeu";
            break;
        case "Intro Reseau":
            newMatiere = "🖨 Intro Reseau";
            break;
    
        default:
            break;
    }
    return newMatiere;
}