import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {
    ButtonCommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType
} from '../../types';
import {ButtonCommand} from '../Command';

export const ConfigCancel: ButtonCommand = {
    name: ButtonCommandNames.CONFIG_CANCEL,
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
        } catch (error: ErrorType) {
            errorHandler('EditBis', error, interaction);
        }
    }
};
