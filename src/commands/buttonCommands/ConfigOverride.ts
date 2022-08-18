import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {getGuildConfig} from '../database/actions/guildConfig/getGuildConfig';
import {GuildConfigType} from '../database/types/DataType';

import {errorHandler} from '../handler';
import {strings} from '../locale/i18n';
import Logger from '../logger';

import {
    ButtonCommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    OptionNames
} from '../types';
import {checkPermission} from '../utils/permissions';
import {ButtonCommand} from './Command';
import {setConfig} from './slashCommands/ConfigureBotForGuild';

const logger = Logger.child({module: ButtonCommandNames.CONFIG_OVERRIDE});

export const ConfigOverride: ButtonCommand = {
    name: ButtonCommandNames.CONFIG_OVERRIDE,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                logger.warn('no interaction.guildId');
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.coruptInteraction'
                    })
                );
            }
            const guildConfig: GuildConfigType = await getGuildConfig(
                interaction.guildId,
                interaction
            );
            const hasPermission = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig.static_role
            );

            if (!guildConfig.guild_id) {
                return interaction.followUp({
                    content: `Something went wrong!`,
                    ephemeral: true
                });
            }
            console.log('HERE', guildConfig.guild_id);

            if (
                interaction.user.id ===
                    interaction.message.interaction?.user.id &&
                hasPermission
            ) {
                if (interaction.message.embeds[0].fields) {
                    const moderator_role =
                        interaction.message.embeds[0].fields.find(
                            (field) => field.name === OptionNames.MODERATOR_ROLE
                        )?.value;

                    const static_role =
                        interaction.message.embeds[0].fields.find(
                            (field) => field.name === OptionNames.STATIC_ROLE
                        )?.value;

                    if (moderator_role && static_role) {
                        setConfig(
                            interaction,
                            moderator_role,
                            static_role,
                            guildConfig.guild_id ? true : false
                        );
                        return interaction.deleteReply();
                    }
                }
            } else {
                interaction.followUp({
                    content: `These buttons aren't for you!`,
                    ephemeral: true
                });
            }
        } catch (error: ErrorType) {
            errorHandler('EditBis', error, interaction);
        }
    }
};
