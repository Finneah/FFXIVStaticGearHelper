import { Routes } from 'discord-api-types/rest/v10';
import { REST } from 'discord.js';

import { GlobalCommands } from './commands/Commands';
import { TOKEN } from './config';

export const registerGlobalCommands = async (clientId: string) => {
    try {
        // TODO Take GuildId from onGuildCreate

        try {
            console.log(
                `Started refreshing ${GlobalCommands.length} application (/) commands.`
            );

            const rest = new REST({version: '10'}).setToken(TOKEN);
            const data: any = await rest.put(
                Routes.applicationCommands(clientId),
                {
                    body: GlobalCommands
                }
            );
            let addedCommands = '';
            data.forEach((d: {name: string}) => {
                addedCommands += d.name + ' ';
            });
            console.log(
                `Successfully reloaded ${addedCommands} application (/) commands.`
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.warn('ERROR', error.message);
        }
    } catch (error) {
        console.warn(error);
    }
};
