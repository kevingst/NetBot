const { MessageEmbed } = require("discord.js");
const mysql = require('mysql');
const configJSON = require("../../config.json");
const { createLog } = require("../../functions.js");
const moment = require('moment');

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
                if(rows.length != 0) {
                rows.forEach(function(row) {
                    try {
                        var matiere = row.matiere;
                        var intitule = row.info_devoir;
                        var dateDevoir = new Date(row.date_devoir);

                        moment.locale("fr")
                        let dateDevoirFormat = moment(dateDevoir).format('dddd Do MMMM');
                        var devoir = `> **【**${getEmoji(matiere)}**】** ${intitule}`;
                        embed.addFields({ name: `**${dateDevoirFormat.charAt(0).toUpperCase() + dateDevoirFormat.substring(1).toLowerCase()}**:`, value: devoir, inline: false })
                    } catch (error) {
                        console.error('Erreur: Envoi du message Discord !');
                        console.error(error);
                    }
                });
            } else {
                embed.addFields({ name: `Aucun devoir`, value: `> 💤💤`, inline: false })
            }
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

function getEmoji(matiere){
    var newMatiere;
    switch (matiere) {
        case "Éthique & Politique":
            newMatiere = "📔 Éthique & Politique";
            break;
        case "Amélioration Application":
            newMatiere = "📱 Amélioration Application";
            break;
        case "Projet Web":
            newMatiere = "💻 Projet Web";
            break;
        case "Anglais 1":
            newMatiere = "👅 Anglais 1";
            break;
        case "Anglais 2":
            newMatiere = "👅 Anglais 2";
            break;
        case "Jeux Vidéo 3D":
            newMatiere = "🎮 Jeux Vidéo 3D";
            break;
        case "Stage":
            newMatiere = "🧰 Stage";
            break;
    
        default:
            break;
    }
    return newMatiere;
}