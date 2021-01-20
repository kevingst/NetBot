const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { createLog } = require("../../functions.js");

module.exports = {
    name: "help",
    aliases: ["h", "aide"],
    category: "information",
    description: "Retourne toutes les commandes ou les informations d'une commande spécifique.",
    usage: "[command | alias]",
    run: async(client, message, args, command) => {
        // If there's an args found
        // Send the info of that command found
        // If no info found, return not found embed.        
        if (args[0]) {
            createLog(command, message.member, message.channel, args[0]);
            return getCMD(client, message, args[0]);
        } else {
            // Otherwise send all the commands available
            // Without the cmd info
            createLog(command, message.member, message.channel);
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")

    // Map all the commands
    // with the specific category
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    // Map all the categories
    const info = client.categories
        .map(cat => stripIndents `**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    embed.setTimestamp()
    embed.setFooter(`NetBot v2.5`);
    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    // Get the cmd by the name or alias
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `Pas d'information concernant la commande **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    // Add all cmd info to the embed
    if (cmd.name) info = "**Nom de la commande**: `" + `${cmd.name}` + "`";
    if (cmd.aliases) info += `\n**Alias**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}