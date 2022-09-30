import {QueryConfig} from 'pg';
import {errorHandler} from '../../../handler';
import Logger from '../../../logger';

import {runQuery} from '../../database';
import {BisLinksType} from '../../types/DataType';

const logger = Logger.child({module: 'getBis'});

/**
 * @description get all bis from User for Autofill /bis get
 * @param userId
 * @returns BisLinksType[]
 */
export const getAllBisByUserByGuild = async (
    userId: string,
    guildId: string
): Promise<BisLinksType[] | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-BisByUser',
            text: 'SELECT * FROM bis WHERE user_id=$1 AND guild_id=$2;',
            values: [userId, guildId]
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
 * @param userId string
 * @param bis_name string
 * @param guild_id string
 * @returns BisLinksType[]
 */
export const getBisByUserByName = async (
    userId: string,
    bis_name: string,
    guild_id: string
): Promise<BisLinksType | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-BisByUserByName',
            text: 'SELECT * FROM bis WHERE user_id=$1 AND bis_name=$2 AND guild_id=$3;',
            values: [userId, bis_name, guild_id]
        };

        const res = await runQuery(query);
        logger.info(`get-BisByUserByName ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description get all Main bis for guild
 * @param guild_id string
 * @returns Promise<BisLinksType[] | null>
 */
export const getMainBisAll = async (
    guild_id: string
): Promise<BisLinksType[] | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-AllMainBis',
            text: 'SELECT * FROM bis WHERE is_main=true AND guild_id=$1;',
            values: [guild_id]
        };

        const res = await runQuery(query);

        logger.info(
            `get-AllMainBis ${res.rows.length} ${JSON.stringify(res?.rows)}`
        );
        return res?.rows ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description get MainBis from User
 * @param userId string
 * @param guild_id string
 * @returns Promise<BisLinksType | null>
 */
export const getMainBisByUser = async (
    userId: string,
    guild_id: string
): Promise<BisLinksType | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-MainBisFromUser',
            text: 'SELECT * FROM bis  WHERE is_main=true AND user_id=$1 AND guild_id=$2',
            values: [userId, guild_id]
        };

        const res = await runQuery(query);
        logger.info(`get-MainBisFromUser ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};
