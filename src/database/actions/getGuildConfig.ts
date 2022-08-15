// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../types';
import {SeqGuilds} from '../sequelize';
import {GuildConfig} from '../types/GuildConfigType';

export const getGuildConfig = async (guildId: string): Promise<GuildConfig> => {
    try {
        const seqGuildConfig: GuildConfig = await SeqGuilds.findOne({
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
        throw new Error(error);
    }
};
