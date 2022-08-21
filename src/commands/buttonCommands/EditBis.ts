import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {editBisFromUser} from '../../database/actions/bestInSlot/editBisFromUser';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GearTypes} from '../../database/types/DataType';
import {getGearset, errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {ButtonCommandNames, SubCommandNames} from '../../types';
import {checkPermission} from '../../utils/permissions';
import {ButtonCommand} from '../Command';
import {getActionRows} from '../handleGetGearsetEmbedCommand';

/**
 * @description Button Command EditBis,
 * set gear type is looted or not
 */
export const EditBis: ButtonCommand = {
    name: ButtonCommandNames.EDITBIS,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'EditBis',
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

                // if user = user embed
                if (hasPermission && interaction.message.embeds[0].url) {
                    const gearset = await getGearset(
                        SubCommandNames.BY_LINK,
                        interaction.message.embeds[0].url
                    );
                    if (gearset) {
                        let customId = interaction.customId;
                        customId = customId.replace('editbis_', '');

                        const gearType = customId.substring(
                            0,
                            customId.lastIndexOf('_')
                        ) as GearTypes;

                        const bis_name = customId
                            .substring(
                                customId.lastIndexOf('_'),
                                customId.length
                            )
                            .replace('_', '');

                        const bis = await editBisFromUser(
                            bis_name,
                            interaction.user.id,
                            gearType
                        );

                        if (!bis) {
                            handleInteractionError(
                                'EditBis',
                                interaction,
                                strings('error.noSavedBis')
                            );
                            return;
                        }

                        const actionRows = getActionRows(gearset, bis);

                        return await interaction.editReply({
                            components: actionRows
                        });
                    } else {
                        return handleInteractionError(
                            'EditBis',
                            interaction,
                            strings('error.coruptInteraction')
                        );
                    }
                } else {
                    handleInteractionError(
                        'EditBis',
                        interaction,
                        strings('error.permissionDenied')
                    );
                    return;
                }
            } else {
                handleInteractionError(
                    'EditBis',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
        } catch (error) {
            errorHandler('EditBis', error);
            return;
        }
    }
};
