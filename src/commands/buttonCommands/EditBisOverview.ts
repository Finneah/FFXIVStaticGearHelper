import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {getMainBisByUser} from '../../api/database/actions/bestInSlot/getBis';
import {setMainBisGearByUser} from '../../api/database/actions/bestInSlot/setBis';

import {dbGetGuildById} from '../../api/database/actions/guildConfig/getGuildConfig';
import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {ButtonCommandNames} from '../../types';
import {checkPermission} from '../../utils/permissions';
import {ButtonCommand} from '../Command';
import {getEmbedStaticOverview} from '../getEmbedStaticOverview';
const logger = Logger.child({module: 'EditBisOverview'});
/**
 * @description Button Command EditBis,
 * set gear type is looted or not
 */
export const EditBisOverview: ButtonCommand = {
    name: ButtonCommandNames.EDITBISOVERVIEW,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'EditBisOverview',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            const guildConfig = await dbGetGuildById(interaction.guildId);
            const hasPermission = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.static_role
            );
            if (!guildConfig) {
                // return interaction set config first
                return;
            }

            if (hasPermission) {
                let customId = interaction.customId;
                customId = customId.replace('static_overview_', '');

                customId = customId.replace('_l_l', '_l').replace('_r_r', '_r');

                if (customId === ButtonCommandNames.REFRESH) {
                    const embed = await getEmbedStaticOverview(
                        client,
                        interaction,
                        guildConfig
                    );

                    return interaction.editReply({
                        embeds: [embed]
                    });
                }

                await setMainBisGearByUser(
                    interaction.user.id,
                    customId,
                    interaction.guildId
                );

                const embed = await getEmbedStaticOverview(
                    client,
                    interaction,
                    guildConfig
                );

                const bis = await getMainBisByUser(
                    interaction.user.id,
                    interaction.guildId
                );

                if (bis?.bis_message_id) {
                    await interaction.channel?.messages
                        .fetch(bis.bis_message_id)
                        .then(async (message) => {
                            if (message) {
                                // const gearset = await getGearset(
                                //     SubCommandNames.BY_LINK,
                                //     bis.bis_link
                                // );
                                // if (gearset) {
                                //     const actionRows = getActionRowsForEditBis(
                                //         gearset,
                                //         bis
                                //     );
                                //     message.edit({
                                //         components: actionRows
                                //     });
                                // }
                            }
                        })
                        .catch((error) =>
                            logger.info('No message found' + error.message)
                        );
                }

                return interaction.editReply({
                    content: `*<@${interaction.user.id}>* hat den Status aktualisiert`,
                    embeds: [embed]
                });
            } else {
                handleInteractionError(
                    'EditBisOverview',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
        } catch (error) {
            errorHandler('EditBisOverview', error);
            return;
        }
    }
};
