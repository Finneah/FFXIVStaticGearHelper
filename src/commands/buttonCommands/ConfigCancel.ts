import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {ButtonCommandNames} from '../../types';
import {ButtonCommand} from '../Command';

/**
 * @description Button Command Config Cancel,
 * cancel interaction config already exist
 */
export const ConfigCancel: ButtonCommand = {
    name: ButtonCommandNames.CANCEL,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'ConfigCancel',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }
            return interaction.deleteReply();
        } catch (error) {
            errorHandler('EditBis', error);
        }
    }
};
