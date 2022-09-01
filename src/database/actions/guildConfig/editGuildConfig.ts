import {GuildConfig} from '../../types/DataType';

import Logger from '../../../logger';
import {errorHandler} from '../../../handler';
import {QueryConfig} from 'pg';
import {runQuery} from '../../database';

const logger = Logger.child({module: 'editGuildConfig'});

/**
 * @description edit the GuildConfig on slash command /config set override
 * @param guildConfig GuildConfigType
 */
export const editGuildConfig = async (
    guildConfig: GuildConfig
): Promise<void> => {
    try {
        const moderator_role = guildConfig.moderator_role
            ?.replace('<@', '')
            .replace('>', '');
        const static_role = guildConfig.static_role
            ?.replace('<@', '')
            .replace('>', '');
        const query: QueryConfig = {
            name: 'edit-GuildConfig',
            text: 'UPDATE guilds SET moderator_role=$1, static_role=$2 WHERE guild_id=$3;',
            values: [moderator_role, static_role, guildConfig.guild_id]
        };

        const res = await runQuery(query);
        logger.info(`edit-GuildConfig ${JSON.stringify(res?.rows[0])}`);
    } catch (error) {
        errorHandler('editGuildConfig', error);
    }
};
