import {REST} from 'discord.js';
import {Commands} from './commands/Commands';
import {APP_ID, TOKEN} from './config';
import {Routes} from 'discord-api-types/rest/v10';

export const registerGuildCommands = async (guildId: string) => {
    try {
        // TODO Take GuildId from onGuildCreate

        try {
            const rest = new REST({version: '10'}).setToken(TOKEN);

            await rest.put(Routes.applicationGuildCommands(APP_ID, guildId), {
                body: Commands
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.warn('ERROR', error.message);
        }
    } catch (error) {
        console.warn(error);
    }
};
