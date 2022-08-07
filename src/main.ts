import {Client, ClientOptions, Partials} from 'discord.js';
import {TOKEN} from './config';
import guildCreate from './listeners/guildCreate';
import interactionCreate from './listeners/interactionCreate';
import messageCreate from './listeners/messageCreate';
import ready from './listeners/ready';

const options: ClientOptions = {
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent',
        'DirectMessages',
        'DirectMessageTyping',
        'DirectMessageReactions'
    ],
    // necessary to write DM Messages
    partials: [Partials.Channel]
};

const client = new Client(options);

ready(client);
guildCreate(client);
interactionCreate(client);
messageCreate(client);

client.login(TOKEN);
