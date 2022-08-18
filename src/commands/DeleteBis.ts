import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {deleteBisFromUser} from '../database/actions/bestInSlot/deleteBisFromUser';
import {getGuildConfig} from '../database/actions/guildConfig/getGuildConfig';
import {GuildConfigType} from '../database/types/DataType';

import {errorHandler} from '../handler';
import {strings} from '../locale/i18n';
import Logger from '../logger';

import {
    ButtonCommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType
} from '../types';
import {checkPermission} from '../utils/permissions';
import {ButtonCommand} from './Command';

const logger = Logger.child({module: ButtonCommandNames.DELETE_BIS});

export const DeleteBis: ButtonCommand = {
    name: ButtonCommandNames.DELETE_BIS,
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

            if (
                interaction.user.id === interaction.message.interaction?.user.id
            ) {
                const guildConfig: GuildConfigType = await getGuildConfig(
                    interaction.guildId,
                    interaction
                );
                const hasPermission = await checkPermission(
                    interaction,
                    interaction.guildId,
                    guildConfig.static_role
                );

                // if user = user embed
                if (hasPermission && interaction.message.embeds[0].url) {
                    deleteBisFromUser(
                        interaction.customId.replace(
                            ButtonCommandNames.DELETE_BIS + '_',
                            ''
                        ),
                        interaction.user.id
                    );
                    await interaction.deleteReply();
                } else {
                    interaction.followUp({
                        content: `Missing permission!`,
                        ephemeral: true
                    });
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
