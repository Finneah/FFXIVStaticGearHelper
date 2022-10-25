import { Routes } from 'discord-api-types/rest/v10';
import { REST } from 'discord.js';

import { GuildCommands } from './commands/Commands';
import { APP_ID, TOKEN } from './config';

export const registerGuildCommands = async (guildId: string) => {
    try {
        try {
            console.log(
                `Started refreshing ${GuildCommands.length} guild (/) commands.`
            );

            const rest = new REST({version: '10'}).setToken(TOKEN);

            const data: any = await rest.put(
                Routes.applicationGuildCommands(APP_ID, guildId),
                {
                    body: GuildCommands
                }
            );
            let addedCommands = '';
            data.forEach((d: {name: string}) => {
                addedCommands += d.name + ' ';
            });
            console.log(
                `Successfully reloaded ${addedCommands} guild (/) commands.`
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.warn('ERROR', error.message);
        }
    } catch (error) {
        console.warn(error);
    }
};
