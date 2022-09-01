import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {deleteBisFromUser} from '../../database/actions/bestInSlot/deleteBisFromUser';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {ButtonCommandNames} from '../../types';
import {checkPermission} from '../../utils/permissions';
import {ButtonCommand} from '../Command';

/**
 * @todo Dont delete instantly, ask if sure before
 * @description Button Command DeleteBis
 */
export const DeleteBis: ButtonCommand = {
    name: ButtonCommandNames.DELETE_BIS,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'DeleteBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            if (
                interaction.user.id === interaction.message.interaction?.user.id
            ) {
                const guildConfig = await getGuildConfig(interaction.guildId);
                const hasPermission = await checkPermission(
                    interaction,
                    interaction.guildId,
                    guildConfig?.static_role
                );

                if (hasPermission) {
                    deleteBisFromUser(
                        interaction.customId.replace(
                            ButtonCommandNames.DELETE_BIS + '_',
                            ''
                        ),
                        interaction.user.id
                    );
                    await interaction.deleteReply();
                } else {
                    handleInteractionError(
                        'DeleteBis',
                        interaction,
                        strings('error.permissionDenied')
                    );
                    return;
                }
            } else {
                handleInteractionError(
                    'DeleteBis',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
        } catch (error) {
            errorHandler('DeleteBis', error);
        }
    }
};
