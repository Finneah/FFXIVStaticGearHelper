import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {
    ButtonCommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType
} from '../../types';
import {ButtonCommand} from '../Command';

const logger = Logger.child({module: ButtonCommandNames.CONFIG_CANCEL});

export const ConfigCancel: ButtonCommand = {
    name: ButtonCommandNames.CONFIG_CANCEL,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'ShowEtroBis',
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
