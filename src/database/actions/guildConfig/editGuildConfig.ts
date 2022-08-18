import {GuildConfigType} from '../../types/DataType';
import {SeqGuilds} from '../../sequelize';
import Logger from '../../../logger';
const logger = Logger.child({module: 'editGuildConfig'});
export const editGuildConfig = async (guildConfig: GuildConfigType) => {
    await SeqGuilds.update(
        {
            moderator_role: guildConfig.moderator_role,
            static_role: guildConfig.static_role
        },
        {where: {guild_id: guildConfig.guild_id}}
    );
    logger.info(
        `Guild ID ${
            guildConfig.moderator_role + ' ' + guildConfig.static_role
        } is updated in DB`
    );
};
