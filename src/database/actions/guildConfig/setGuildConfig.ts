import {GuildConfigType} from '../../types/DataType';

import {runQuery} from '../../database';
import Logger from '../../../logger';
import {QueryConfig} from 'pg';

const logger = Logger.child({module: 'setGuildConfig'});

/**
 * @todo bis_channel
 * @description save the GuildConfig on slash command /config set
 * @param guildConfig GuildConfigTyle
 */
export const setGuildConfig = async (
    guildConfig: GuildConfigType
): Promise<void> => {
    try {
        const query: QueryConfig = {
            name: 'set-GuildConfig',
            text: 'INSERT INTO guilds(guild_id, moderator_role,static_role) VALUES($1, $2, $3);',
            values: [
                guildConfig.guild_id,
                guildConfig.moderator_role,
                guildConfig.static_role
            ]
        };

        const res = await runQuery(query);
        logger.info(`set-GuildConfig ${JSON.stringify(res?.rows)}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
