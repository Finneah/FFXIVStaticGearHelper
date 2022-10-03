import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';
import {NODE_ENV, LOCAL_GUILD_ID} from '../config';

import Logger from '../logger';
import {fetchGuilds} from '../redux/guilds/guilds.actions';
import {fetchJobs} from '../redux/jobs/jobs.actions';

import {store} from '../redux/store';
import {registerGuildCommands} from '../registerGuildCommands';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        if (NODE_ENV !== 'production') {
            registerGuildCommands(LOCAL_GUILD_ID);
            registerGuildCommands('1004408026922487838');
        } else {
            await client.application.commands.set(Commands);
        }
        store.dispatch(fetchGuilds());
        store.dispatch(fetchJobs());
        Logger.info('ONLINE');
    });
};
