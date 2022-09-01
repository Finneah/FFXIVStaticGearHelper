import {QueryConfig} from 'pg';
import {errorHandler} from '../../../handler';
import Logger from '../../../logger';

import {runQuery} from '../../database';
import {BisLinksType} from '../../types/DataType';

const logger = Logger.child({module: 'getBis'});

/**
 * @description get all bis from User for Autofill /bis get
 * @param userId
 * @param interaction
 * @returns BisLinksType[]
 */
export const getAllBisByUser = async (
    userId: string
): Promise<BisLinksType[] | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-BisByUser',
            text: 'SELECT * FROM bis WHERE user_id=$1;',
            values: [userId]
        };

        const res = await runQuery(query);
        logger.info(`get-BisForUser ${JSON.stringify(res?.rows)}`);

        return res?.rows ?? null;
    } catch (error) {
        errorHandler('getBisByUser', error);
        return Promise.reject('getBisByUser');
    }
};

/**
 * @description get specific bis from User on slash command /bis get
 * @param userId
 * @param interaction
 * @returns BisLinksType[]
 */
export const getBisByUserByName = async (
    userId: string,
    bis_name: string
): Promise<BisLinksType | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-BisByUserByName',
            text: 'SELECT * FROM bis WHERE user_id=$1 AND bis_name=$2;',
            values: [userId, bis_name]
        };

        const res = await runQuery(query);
        logger.info(`get-BisByUserByName ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllMainBis = async (): Promise<BisLinksType[] | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-AllMainBis',
            text: 'SELECT * FROM bis WHERE is_main=true;'
        };

        const res = await runQuery(query);
        console.log(`HERE get-AllMainBis ${res.rows.length}`);
        logger.info(
            `get-AllMainBis ${res.rows.length} ${JSON.stringify(res?.rows)}`
        );
        return res?.rows ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getMainBisFromUser = async (
    userId: string
): Promise<BisLinksType | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-MainBisFromUser',
            text: 'SELECT * FROM bis  WHERE is_main=true AND user_id=$1',
            values: [userId]
        };

        const res = await runQuery(query);
        logger.info(`get-MainBisFromUser ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};
