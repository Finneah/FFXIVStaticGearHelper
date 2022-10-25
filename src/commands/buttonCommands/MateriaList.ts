import { ApplicationCommandType, ButtonInteraction, Client } from 'discord.js';

import { errorHandler, handleInteractionError } from '../../handler';
import { getGearset } from '../../handler/etroHandler/etroGearset';
import { strings } from '../../locale/i18n';
import Logger from '../../logger';
import { ButtonCommandNames } from '../../types';
import { ButtonCommand } from '../Command';

const logger = Logger.child({module: 'EditBis'});

export const MateriaList: ButtonCommand = {
    name: ButtonCommandNames.MATERIALIST,
    dmPermission: true,
    type: ApplicationCommandType.Message,

    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            const customId = interaction.customId;
            console.log('customId', customId);
            if (interaction.message.embeds[0].url) {
                console.log('url', interaction.message.embeds[0].url);

                const {data: gearset} = await getGearset(
                    interaction.message.embeds[0].url
                );
                console.log(gearset?.lastUpdate);
            }
            // if (interaction.user.id === interaction.message.author?.id) {
            //     // if (interaction.message.embeds[0].url) {
            //     //     const {data: gearset} = await getGearset(
            //     //         interaction.message.embeds[0].url
            //     //     );
            //     //     if (gearset) {
            //     //         const customId = interaction.customId;

            //     //     }
            //     // }
            // }
        } catch (error) {
            errorHandler('EditBis', error);
            return;
        }
    }
};
