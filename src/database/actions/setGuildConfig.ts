import {GuildConfig} from '../types/GuildConfigType';
import {SeqGuilds} from '../sequelize';

export const setGuildConfig = async (guildConfig: GuildConfig) => {
    const config: GuildConfig = {
        guild_id: guildConfig.guild_id,
        moderator_role: guildConfig.moderator_role,
        static_role: guildConfig.static_role
    };
    const seqGuildConfig = await SeqGuilds.create(config);
    console.info(
        `Guild ID ${
            seqGuildConfig.guild_id +
            ' ' +
            seqGuildConfig.moderator_role +
            ' ' +
            seqGuildConfig.static_role
        } is saved in DB`
    );
};
