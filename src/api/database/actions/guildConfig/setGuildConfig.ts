import {runQuery} from '../../database';
import Logger from '../../../../logger';
import {QueryConfig} from 'pg';
import {SGHGuild} from '../../../../redux/guilds/guilds.types';

const logger = Logger.child({module: 'dbAddGuild'});

/**
 * @todo bis_channel
 * @description save the DBGuild on slash command /config set
 * @param guild GuildConfigTyle
 */
export const dbAddGuild = async (guild: SGHGuild): Promise<void> => {
    try {
        const {moderator_role, static_role, discord_guild_id} = guild;
        const query: QueryConfig = {
            name: 'set-DBGuild',
            text: 'INSERT INTO guilds(discord_guild_id, moderator_role,static_role) VALUES($1, $2, $3);',
            values: [discord_guild_id, moderator_role, static_role]
        };

        const res = await runQuery(query);
        logger.info(`set-DBGuild ${JSON.stringify(res?.rows)}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
