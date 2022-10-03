import {QueryConfig} from 'pg';
import {errorHandler} from '../../../../handler';
import Logger from '../../../../logger';
import {runQuery} from '../../database';
const logger = Logger.child({module: 'deleteBisFromUser'});

/**
 * @description delete bis from user
 * @param {string} bis_name bis should be deleted
 * @param {string} user_Id for which user should be deleted
 * @param {string} guild_id from which server should be deleted
 */
export const deleteBisSingle = async (
    bis_name: string,
    user_Id: string,
    guild_id: string
) => {
    try {
        const query: QueryConfig = {
            name: 'delete-BisFromUser',
            text: 'DELETE FROM bis WHERE bis_name=$1 AND user_id=$2 AND guild_id=$2;',
            values: [bis_name, user_Id, guild_id]
        };

        const res = await runQuery(query);
        logger.info(`delete-BisFromUser ${JSON.stringify(res?.rows[0])}`);
    } catch (error) {
        errorHandler('deleteBisFromUser', error);
    }
};
