import {Client, Message} from 'discord.js';
export default (client: Client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) {
            return;
        }

        const content = message.content.toLowerCase();

        if (content === 'ping') {
            onPing(message);
        }
    });
};

const onPing = async (message: Message<boolean>) => {
    await message.reply(
        message.member?.displayName || message.author.username + ': Pong!'
    );
};
