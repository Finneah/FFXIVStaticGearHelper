import {GuildConfigType} from '../types/GuildConfigType';
import {GuildConfig} from '../sequelize';

export const setGuildId = async (id: string, userRole: string) => {
    const config: GuildConfigType = {
        guild_id: id,
        user_role: userRole
    };

    const guildConfig = await GuildConfig.create(config);
    console.log(
        `Guild ID ${
            guildConfig.guild_id + ' ' + guildConfig.user_role
        } is saved in DB`
    );
};
