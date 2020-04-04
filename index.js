const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("[Succès] Connexion a la base de donnée !");
});

const client = new Client({
    disableEveryone: true
})

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "apprendre la vie",
            type: "STREAMING"
        }
    });
})

client.on("message", async message => {
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);

    // Message des cours
    setInterval(() => {
        let nextminute = new Date();
        nextminute.setMinutes(nextminute.getMinutes() + 5);
        // Message des cours
        if (new Date().getSeconds() === 0) {
            //console.log((nextminute.getHours()<10?'0':'') + nextminute.getHours()+":"+(nextminute.getMinutes()<10?'0':'') + nextminute.getMinutes());
            sendMessageCours(nextminute);
        }
    }, 1000);
});

client.login(process.env.TOKEN);

function sendMessageCours(nextminute) {
    var channel = client.channels.cache.get('692062188256624703');
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "dimanche";
    weekday[1] = "lundi";
    weekday[2] = "mardi";
    weekday[3] = "mercredi";
    weekday[4] = "jeudi";
    weekday[5] = "vendredi";
    weekday[6] = "samedi";
    var n = weekday[d.getDay()];
    con.query("SELECT * FROM cours Where debut = '" + (nextminute.getHours() < 10 ? '0' : '') + nextminute.getHours() + ":" + (nextminute.getMinutes() < 10 ? '0' : '') + nextminute.getMinutes() + ":00' AND jour = '" + n + "' AND actif = 1", function(err, rows, fields) {
        if (rows != undefined) {
            rows.forEach(function(row) {
                try {
                    channel.send('Le cours de ' + row.nom + ' commencera dans 5 minutes');
                } catch (error) {
                    console.error('Erreur: Envoi du message Discord !');
                    console.error(error);
                }
                console.log('Le cours de ' + row.nom + ' commencera dans 5 minutes');
            });
        }
    });

    con.query("SELECT * FROM cours Where fin = '" + (nextminute.getHours() < 10 ? '0' : '') + nextminute.getHours() + ":" + (nextminute.getMinutes() < 10 ? '0' : '') + nextminute.getMinutes() + ":00' AND jour = '" + n + "' AND actif = 1", function(err, rows, fields) {
        if (rows != undefined) {
            rows.forEach(function(row) {
                try {
                    channel.send('Le cours de ' + row.nom + ' sera fini dans 5 minutes');
                } catch (error) {
                    console.error('Erreur: Envoi du message Discord !');
                    console.error(error);
                }
                console.log('Le cours de ' + row.nom + ' sera fini dans 5 minutes');
            });
        }
    });

    if (d.getHours() == '18' && d.getMinutes() == '00' && (n == 'lundi' || n == 'mardi' || n == 'mercredi' || n == 'jeudi' || n == 'vendredi')) {
        channel.send('Bonne fin de journée !');
    }
}
