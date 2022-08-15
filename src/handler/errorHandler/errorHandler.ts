import {CommandInteraction, CacheType} from 'discord.js';
import {strings} from '../../locale/i18n';

import {ErrorType} from '../../types';

export const errorHandler = (
    namespace: string,
    error: ErrorType,
    interaction?: CommandInteraction<CacheType>
) => {
    console.warn('ERROR ' + namespace, error);
    let message = error.message;
    if (message && message.search('AxiosError') !== -1) {
        // TODO refactor auslagern
        message = message.split('AxiosError')[1];
        if (message.search('Request failed with status code 404') !== -1) {
            message = strings('error.wrongRequest');
        }
    }

    if (error.name && error.name === 'SequelizeDatabaseError') {
        message = handleDBError(error);
    }
    if (interaction) {
        showInteraction(interaction, message);
    }
};

const handleDBError = (error: ErrorType) => {
    let message = error.code;
    switch (error.code) {
        case 'SQLITE_ERROR':
            console.warn('SQLITE_ERROR', error.sql);
            break;

        default:
            break;
    }

    switch (error.parent.errno) {
        case 1:
            message = strings('sqliteError.noSuchTable');
            break;

        default:
            break;
    }

    return message;
};

const showInteraction = async (
    interaction: CommandInteraction<CacheType>,

    message: ErrorType
) => {
    await interaction.followUp(
        strings('error.general', {details: '\n' + message})
    );
};
