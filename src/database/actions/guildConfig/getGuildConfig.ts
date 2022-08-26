import {QueryConfig} from 'pg';

import Logger from '../../../logger';

import {runQuery} from '../../database';
import {GuildConfig} from '../../types/DataType';

const logger = Logger.child({module: 'getGuildConfig'});

/**
 * @description get the GuildConfig on slash command /config get
 * @param guild_id
 * @param interaction
 * @returns
 */
export const getGuildConfig = async (
    guild_id: string
): Promise<GuildConfig | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-GuildConfig',
            text: 'SELECT * FROM guilds WHERE guild_id=$1;',
            values: [guild_id]
        };

        const res = await runQuery(query);
        logger.info(`get-GuildConfig ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};
