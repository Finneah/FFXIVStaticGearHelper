import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';
import {initDB} from '../database';
import Logger from '../logger';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        initDB();
        await client.application.commands.set(Commands);
        Logger.info('ONLINE');
    });
};
