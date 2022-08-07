import {REST} from 'discord.js';
import {Commands} from './commands/Commands';
import {APP_ID, TOKEN} from './config';
import {Routes} from 'discord-api-types/rest/v10';

const registerGuildCommands = async () => {
    try {
        const guildId = '1234';
        // TODO Take GuildId from onGuildCreate
        const rest = new REST({version: '10'}).setToken(TOKEN);
        console.log('Refresh Guild Commands....');
        await rest.put(Routes.applicationGuildCommands(APP_ID, guildId), {
            body: Commands
        });
        console.log('Successfully reloaded Guild Commands');
    } catch (error) {
        console.warn(error);
    }
};
