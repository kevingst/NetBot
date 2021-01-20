const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const configJSON = require("./config.json");
const mysql = require('mysql');

var con = mysql.createConnection({
    host: configJSON.host,
    user: configJSON.user,
    password: configJSON.password,
    database: configJSON.database
});

con.connect(function(err) {
    if (err) throw err;
    console.log("[BDD] Connexion a la base de donnée avec succès !");
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
    console.log(`Hey, ${client.user.username} est en ligne !`);    

    client.user.setPresence({
        status: "online",
        activity: {
            name: "!help",
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
        command.run(client, message, args, command);
});

client.login(process.env.TOKEN);