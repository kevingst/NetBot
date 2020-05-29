const { createLog } = require("../../functions.js");

module.exports = {
    name: "ping",
    category: "information",
    description: "Retourne la latence",
    run: async(client, message, args, command) => {
        const msg = await message.channel.send(':ping_pong: ping en cour...');
        var ms = Math.floor(msg.createdAt - message.createdAt);
        msg.edit(`:ping_pong: Pong | ${ms}ms`);
        createLog(command, message.member, message.channel, ms);
    }
}