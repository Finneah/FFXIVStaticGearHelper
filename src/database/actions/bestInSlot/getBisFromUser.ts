// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {CommandInteraction, CacheType} from 'discord.js';
import {errorHandler} from '../../../handler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../../types';
import {SeqBiSLinks} from '../../sequelize';
import {BisLinksType} from '../../types/DataType';

export const getBisByUser = async (
    userId: string,
    interaction?: CommandInteraction<CacheType> | undefined
): Promise<BisLinksType[]> => {
    try {
        const seqUserBisLinks: BisLinksType[] = await SeqBiSLinks.findAll({
            where: {user_id: userId}
        });

        return seqUserBisLinks;
    } catch (error: ErrorType) {
        errorHandler('getBisFromUser', error, interaction);
        return Promise.reject('getBisFromUser');
    }
};

export const getBisByUserByName = async (
    userId: string,
    bis_name: string,
    interaction?: CommandInteraction<CacheType> | undefined
): Promise<BisLinksType> => {
    try {
        const seqUserBisLinks: BisLinksType = await SeqBiSLinks.findOne({
            where: {user_id: userId, bis_name: bis_name}
        });

        return seqUserBisLinks;
    } catch (error: ErrorType) {
        errorHandler('getBisFromUser', error, interaction);
        return Promise.reject('getBisFromUser');
    }
};
