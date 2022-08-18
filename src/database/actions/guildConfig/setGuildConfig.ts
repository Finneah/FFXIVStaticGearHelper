import {GuildConfigType} from '../../types/DataType';
import {SeqGuilds} from '../../sequelize';
import {errorHandler} from '../../../handler';

export const setGuildConfig = (guildConfig: GuildConfigType): void => {
    try {
        const config: GuildConfigType = {
            guild_id: guildConfig.guild_id,
            moderator_role: guildConfig.moderator_role,
            static_role: guildConfig.static_role
        };

        SeqGuilds.create(config);
    } catch (error) {
        errorHandler('setGuildConfig', error);
    }
};
