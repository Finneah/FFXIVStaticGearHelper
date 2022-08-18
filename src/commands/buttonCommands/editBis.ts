import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {editBisFromUser} from '../../database/actions/bestInSlot/editBisFromUser';
import {getBisByUserByName} from '../../database/actions/bestInSlot/getBisFromUser';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GearTypes, GuildConfigType} from '../../database/types/DataType';

import {errorHandler, getGearset} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {
    CommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    SubCommandNames
} from '../../types';
import {checkPermission} from '../../utils/permissions/permissions';
import {ButtonCommand} from '../Command';
import {getActionRows} from '../handleGetGearsetEmbedCommand';

const logger = Logger.child({module: CommandNames.EDITBIS});

export const EditBis: ButtonCommand = {
    name: CommandNames.EDITBIS,
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
                            content: 'A button was clicked!',
                            components: actionRows
                        });
                    } else {
                        interaction.followUp({content: 'Gearset is missing'});
                    }
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
