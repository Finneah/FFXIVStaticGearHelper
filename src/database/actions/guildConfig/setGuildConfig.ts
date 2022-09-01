import {GuildConfig} from '../../types/DataType';

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
    guildConfig: GuildConfig
): Promise<void> => {
    try {
        const moderator_role = guildConfig.moderator_role
            ?.replace('<@&', '')
            .replace('>', '');
        const static_role = guildConfig.static_role
            ?.replace('<@&', '')
            .replace('>', '');
        const query: QueryConfig = {
            name: 'set-GuildConfig',
            text: 'INSERT INTO guilds(guild_id, moderator_role,static_role) VALUES($1, $2, $3);',
            values: [guildConfig.guild_id, moderator_role, static_role]
        };

        const res = await runQuery(query);
        logger.info(`set-GuildConfig ${JSON.stringify(res?.rows)}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @todo bis_channel
 * @description save the GuildConfig on slash command /config set
 * @param guildConfig GuildConfigTyle
 */
export const setGuildMessageId = async (
    bis_message_id: string,
    guild_id: string
): Promise<void> => {
    try {
        const query: QueryConfig = {
            name: 'set-GuildConfig',
            text: 'UPDATE guilds SET bis_message_id=$1 WHERE guild_id=$2',
            values: [bis_message_id, guild_id]
        };

        const res = await runQuery(query);
        logger.info(`set-GuildConfig ${JSON.stringify(res?.rows)}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
