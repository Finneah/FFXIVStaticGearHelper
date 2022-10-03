import {Client} from 'discord.js';

export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        // const {id} = guild;
        /**
         * @todo
         * show start message configure bot
         */
        // initDB();
        // if (id) {
        //     //  registerGuildCommands(id);
        //     // guild_id is just a placeholder for typescript
        //     dbAddGuild({guild_id: 0, discord_guild_id: id});
        // }
    });
};
