module.exports = {
    name: "ping",
    category: "info",
    description: "Return latence",
    run: async(client, message, args) => {
        const msg = await message.channel.send(':ping_pong: ping en cour...');

        msg.edit(`:ping_pong: Pong | ${Math.floor(msg.createdAt - message.createdAt)}ms`);
    }
}