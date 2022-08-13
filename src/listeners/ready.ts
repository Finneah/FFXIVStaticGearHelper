import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';
import {SeqGuilds} from '../database';
import {registerGuildCommands} from '../registerGuildCommands';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        SeqGuilds.sync();
        registerGuildCommands('968410103999004732');

        await client.application.commands.set(Commands);
        console.info('Client is online');
    });
};
