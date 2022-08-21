import {Client} from 'discord.js';
import {initDB, setGuildConfig} from '../database';

export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        const {id} = guild;
        /**
         * @todo
         * show start message configure bot
         */
        initDB();
        if (id) {
            //  registerGuildCommands(id);
            // save guildId in DB
            setGuildConfig({guild_id: id});
        }
    });
};
