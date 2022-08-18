import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {editBisFromUser} from '../../database/actions/bestInSlot/editBisFromUser';
import {getBisByUserByName} from '../../database/actions/bestInSlot/getBisFromUser';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GuildConfigType, GearTypes} from '../../database/types/DataType';
import {getGearset, errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ButtonCommandNames, SubCommandNames, ErrorType} from '../../types';
import {checkPermission} from '../../utils/permissions';
import {ButtonCommand} from '../Command';
import {getActionRows} from '../handleGetGearsetEmbedCommand';

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
                    const gearset = await getGearset(
                        SubCommandNames.BY_LINK,
                        interaction.message.embeds[0].url
                    );
                    if (gearset) {
                        const gearType = interaction.customId.split(
                            '_'
                        )[1] as GearTypes;

                        const bis_name = interaction.customId.split('_')[2];

                        await editBisFromUser(
                            bis_name,
                            interaction.user.id,
                            gearType
                        );

                        const bis = await getBisByUserByName(
                            interaction.user.id,
                            bis_name
                        );
                        const actionRows = getActionRows(gearset, bis);

                        await interaction.editReply({
                            components: actionRows
                        });
                    } else {
                        handleInteractionError(
                            'EditBis',
                            interaction,
                            strings('error.coruptInteraction')
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
            } else {
                handleInteractionError(
                    'EditBis',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
        } catch (error: ErrorType) {
            errorHandler('EditBis', error, interaction);
        }
    }
};
