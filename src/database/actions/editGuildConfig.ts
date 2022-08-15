import {GuildConfig} from '../types/GuildConfigType';
import {SeqGuilds} from '../sequelize';

export const editGuildConfig = async (guildConfig: GuildConfig) => {
    await SeqGuilds.update(
        {
            moderator_role: guildConfig.moderator_role,
            static_role: guildConfig.static_role
        },
        {where: {guild_id: guildConfig.guild_id}}
    );
    console.info(
        `Guild ID ${
            guildConfig.moderator_role + ' ' + guildConfig.static_role
        } is updated in DB`
    );
};
