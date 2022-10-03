import {Client, ClientOptions, Partials} from 'discord.js';

import {TOKEN} from './config';
import guildCreate from './listeners/guildCreate';
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';
import Logger from './logger';

const options: ClientOptions = {
    intents: [
        'Guilds',
        'GuildMessages',
        'GuildMembers',
        'MessageContent',
        'DirectMessages',
        'DirectMessageTyping',
        'DirectMessageReactions'
    ],
    // necessary to write DM Messages
    partials: [Partials.Channel]
};

// Redux store

const client = new Client(options);

client.on('debug', (m) => Logger.debug(m));
client.on('warn', (m) => Logger.warn(m));
client.on('error', (m) => Logger.error(m));
client.on('info', (m) => Logger.info(m));

ready(client);
guildCreate(client);
interactionCreate(client);

client.login(TOKEN);
