import {CommandInteraction, CacheType} from 'discord.js';
import {strings} from '../../locale/i18n';

import {ErrorType} from '../../types';

export const errorHandler = (
    namespace: string,
    error: ErrorType,
    interaction?: CommandInteraction<CacheType>
) => {
    console.warn('ERROR ' + namespace, error);

    // TODO refactor auslagern
    let message = error.message;
    if (message.search('AxiosError')) {
        message = message.split('AxiosError')[1];
        if (message.search('Request failed with status code 404')) {
            message = strings('error.wrongRequest');
        }
    }
    if (interaction) {
        showInteraction(interaction, message);
    }
};

const showInteraction = async (
    interaction: CommandInteraction<CacheType>,

    message: ErrorType
) => {
    await interaction.followUp(
        strings('error.general', {details: '\n' + message})
    );
};
