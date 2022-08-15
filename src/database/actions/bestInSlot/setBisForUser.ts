// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {CommandInteraction, CacheType} from 'discord.js';
import {errorHandler} from '../../../handler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../../types';
import {SeqBiSLinks} from '../../sequelize';
import {BisLinksType} from '../../types/DataType';

export const setBisForUser = (
    bisLinkData: BisLinksType,
    interaction?: CommandInteraction<CacheType> | undefined
): void => {
    try {
        SeqBiSLinks.create(bisLinkData);
    } catch (error: ErrorType) {
        errorHandler('getBisFromUser', error, interaction);
    }
};
