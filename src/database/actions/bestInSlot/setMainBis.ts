import {BisLinksType} from '../../types/DataType';

import Logger from '../../../logger';
import {QueryConfig} from 'pg';
import {runQuery} from '../../database';
import {errorHandler} from '../../../handler';

const logger = Logger.child({module: 'setMainBis'});

/**
 * @description update Bis from user, set isMain
 * @param bis_name
 * @param user_id
 * @param allSavedBisFromUser
 * @returns  Promise<string>
 */
export const setMainBis = async (
    bis_name: string,
    user_id: string
): Promise<string> => {
    try {
        const setFalseQuery: QueryConfig = {
            name: 'set-isMain',
            text: `UPDATE bis SET is_main=$1 WHERE user_id=$2;`,
            values: [false, user_id]
        };

        await runQuery(setFalseQuery);

        const setTrueQuery: QueryConfig = {
            name: 'set-isMain',
            text: `UPDATE bis SET is_main=$1 WHERE bis_name=$2 AND user_id=$3;`,
            values: [true, bis_name, user_id]
        };

        await runQuery(setTrueQuery);
        logger.info(
            `set-isMain ${JSON.stringify({
                is_main: true
            })}`
        );
        return `Dein Main BiS ist jetzt **${bis_name}**.\n_Bitte achte darauf dein Main Bis nur in Absprache mit deiner Static zu ändern._`;
    } catch (error) {
        errorHandler('setMainBis', error);
        return Promise.reject('setMainBis');
    }
};
