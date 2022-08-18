import {GuildConfigType} from '../../types/DataType';
import {SeqGuilds} from '../../sequelize';

export const setGuildConfig = (guildConfig: GuildConfigType): void => {
    const config: GuildConfigType = {
        guild_id: guildConfig.guild_id,
        moderator_role: guildConfig.moderator_role,
        static_role: guildConfig.static_role
    };
    SeqGuilds.create(config);
};
