import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';
import {NODE_ENV, LOCAL_GUILD_ID} from '../config';
import {initDB} from '../database';
import Logger from '../logger';
import {registerGuildCommands} from '../registerGuildCommands';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }
        initDB();
        if (NODE_ENV !== 'production') {
            registerGuildCommands(LOCAL_GUILD_ID);
            registerGuildCommands('1004408026922487838');
        } else {
            await client.application.commands.set(Commands);
        }

        Logger.info('ONLINE');
    });
};
