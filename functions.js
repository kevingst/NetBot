const fs = require('fs') 

module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('fr-FR').format(date)
    },

    promptMessage: async function(message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    createLog: async function(command, author, channel, result) {
        var date = new Date();
        var resultat = result;
        const year = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
        const month = new Intl.DateTimeFormat('fr', { month: '2-digit' }).format(date)
        const day = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
        const hour = new Intl.DateTimeFormat('fr', { hour: '2-digit' }).format(date)
        const min = new Intl.DateTimeFormat('fr', { minute: '2-digit' }).format(date)
        const sec = new Intl.DateTimeFormat('fr', { second: '2-digit' }).format(date)

        var time = date.getHours() + ":" + min + ":" + sec;

        var newLine = `[${command.name}] (${author.id}) ${author.displayName} à effectué la commande ! channel: "${channel.name}" | Heure: ${time} \n`
        console.log(newLine);
        if (resultat != " ") {
            resultat = `[${command.name}] Résultat: ${result} \n`;
            console.log(resultat);
        }

        var logFile = `log_${day}_${month}_${year}.txt`

        fs.appendFile(`logs/${logFile}`, `${newLine+resultat}`, function (err) {
            if (err) {
                fs.writeFile(`logs/${logFile}`, `${newLine+resultat}`, (err) => {
                    if (err) throw err; 
                })
            }
         });
    }
};