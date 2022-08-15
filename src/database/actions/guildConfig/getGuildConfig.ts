// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {CommandInteraction, CacheType} from 'discord.js';
import {errorHandler} from '../../../handler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../../types';
import {SeqGuilds} from '../../sequelize';
import {GuildConfigType} from '../../types/DataType';

export const getGuildConfig = async (
    guildId: string,
    interaction: CommandInteraction<CacheType> | undefined
): Promise<GuildConfigType> => {
    try {
        const seqGuildConfig: GuildConfigType = await SeqGuilds.findOne({
            where: {guild_id: guildId}
        });
        if (seqGuildConfig) {
            const guildConfig = {
                ...seqGuildConfig,
                moderator_role: seqGuildConfig.moderator_role,
                static_role: seqGuildConfig.static_role
            };
            return guildConfig;
        }
        return seqGuildConfig;
    } catch (error: ErrorType) {
        errorHandler('getGuildConfig', error, interaction);
        return Promise.reject();
    }
};
