import {
    ButtonInteraction,
    CacheType,
    CommandInteraction,
    Message
} from 'discord.js';

import {strings} from '../../locale/i18n';
import Logger from '../../logger';
import {ErrorType} from '../../types';

export const errorHandler = (namespace: string, error: ErrorType): string => {
    const logger = Logger.child({module: namespace});
    logger.error(error);
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
    return message;
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

export const handleInteractionError = async (
    namespace: string,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    message: string
): Promise<Message<boolean>> => {
    const logger = Logger.child({module: namespace});
    logger.error(message);
    return interaction.followUp({
        ephemeral: true,
        content: strings('error.general', {details: '\n' + message})
    });
};
