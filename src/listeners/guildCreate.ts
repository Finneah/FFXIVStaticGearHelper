import {Client} from 'discord.js';

export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        const {id} = guild;
        /**
         * @todo
         * show start message configure bot
         */
        if (id) {
        }
    });
};
