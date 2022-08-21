import {QueryConfig} from 'pg';
import {errorHandler} from '../../../handler';
import Logger from '../../../logger';
import {runQuery} from '../../database';
const logger = Logger.child({module: 'deleteBisFromUser'});

/**
 * @description delete bis from user
 * @param bis_name string
 * @param user_Id string
 */
export const deleteBisFromUser = async (bis_name: string, user_Id: string) => {
    try {
        const query: QueryConfig = {
            name: 'delete-BisFromUser',
            text: 'DELETE FROM bis WHERE bis_name=$1 AND user_id=$2;',
            values: [bis_name, user_Id]
        };

        const res = await runQuery(query);
        logger.info(`delete-BisFromUser ${JSON.stringify(res?.rows[0])}`);
    } catch (error) {
        errorHandler('deleteBisFromUser', error);
    }
};
