import {Client} from 'discord.js';

export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        const {id} = guild;
        // do something with id
        console.log('TEST', id); // 968410103999004732
        /**
         * @todo
         * save id in DB
         * show start message configure bot
         */
    });
};
