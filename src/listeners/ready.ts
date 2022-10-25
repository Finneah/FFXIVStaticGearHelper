import { Client } from 'discord.js';

import { GuildCommands } from '../commands/Commands';
import { LOCAL_GUILD_ID, NODE_ENV } from '../config';
import Logger from '../logger';
import { fetchGuilds } from '../redux/guilds/guilds.actions';
import { fetchJobs } from '../redux/jobs/jobs.actions';
import { store } from '../redux/store';
import { registerGlobalCommands } from '../registerGlobalCommands';
import { registerGuildCommands } from '../registerGuildCommands';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        registerGlobalCommands(client.application.id);
        if (NODE_ENV !== 'production') {
            // TODO => not here, for payment level only
            registerGuildCommands(LOCAL_GUILD_ID);
        } else {
            await client.application.commands.set(GuildCommands);
        }
        store.dispatch(fetchGuilds());
        store.dispatch(fetchJobs());
        Logger.info('ONLINE');
    });
};
