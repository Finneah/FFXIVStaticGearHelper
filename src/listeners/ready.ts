import {Client} from 'discord.js';
import {Commands} from '../commands/Commands';

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        //   registerGuildCommands('968410103999004732');
        await client.application.commands.set(Commands);
    });
};
