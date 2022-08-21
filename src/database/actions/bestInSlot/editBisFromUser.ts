import {BisLinksType, GearTypes} from '../../types/DataType';

import Logger from '../../../logger';
import {getBisByUserByName} from './getBisFromUser';
import {QueryConfig} from 'pg';
import {runQuery} from '../../database';
import {errorHandler} from '../../../handler';

const logger = Logger.child({module: 'editBisFromUser'});

/**
 * @description update Bis from user, set gear is looted or not
 * @param bis_name string
 * @param user_Id string
 * @param gearType GearTypes
 * @returns  Promise<BisLinksType | null>
 */
export const editBisFromUser = async (
    bis_name: string,
    user_Id: string,
    gearType: GearTypes
): Promise<BisLinksType | null> => {
    try {
        const bis = await getBisByUserByName(user_Id, bis_name);

        if (bis) {
            const looted = bis[gearType] === true ? false : true;

            const query: QueryConfig = {
                name: 'edit-BisFromUser',
                text: `UPDATE bis SET ${gearType}=$1 WHERE bis_id=$2;`,
                values: [looted, bis.bis_id]
            };

            await runQuery(query);
            logger.info(
                `edit-BisFromUser ${JSON.stringify({
                    ...bis,
                    [gearType]: looted
                })}`
            );
            return {...bis, [gearType]: looted} ?? null;
        }
        return bis;
    } catch (error) {
        errorHandler('editBisFromUser', error);
        return Promise.reject('editBisFromUser');
    }
};
