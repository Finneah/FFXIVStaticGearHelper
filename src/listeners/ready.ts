import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';
import {SeqBiSLinks, SeqGuilds} from '../database';
import Logger from '../logger';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        SeqGuilds.sync();
        SeqBiSLinks.sync();
        // registerGuildCommands('968410103999004732');

        await client.application.commands.set(Commands);
        Logger.info('ONLINE');
    });
};
