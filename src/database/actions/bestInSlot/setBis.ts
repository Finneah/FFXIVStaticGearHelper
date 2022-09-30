import {QueryConfig} from 'pg';
import {errorHandler} from '../../../handler';
import Logger from '../../../logger';
import {CommandNames, SubCommandNames, OptionNames} from '../../../types';

import {runQuery} from '../../database';

import {BisLinksType} from '../../types/DataType';

const logger = Logger.child({module: 'setBisForUser'});

/**
 * @description save a Bis on slash command /bis set
 * @param bisLinkData
 * @param guild_id string
 * @returns Promise<string>
 */
export const setBisForUser = async (
    bisLinkData: BisLinksType,
    guild_id: string
): Promise<string> => {
    try {
        const query: QueryConfig = {
            name: 'set-BisForUser',
            text: 'INSERT INTO bis(user_id, bis_name,bis_link,guild_id) VALUES($1, $2, $3,$4);',
            values: [
                bisLinkData.user_id,
                bisLinkData.bis_name,
                bisLinkData.bis_link,
                guild_id
            ]
        };

        const res = await runQuery(query);
        logger.info(`set-BisForUser ${JSON.stringify(res)}`);
        return `BiS ${bisLinkData.bis_name} Gespeichert. Schau es dir mit \`/${CommandNames.MYBIS} ${SubCommandNames.GET} :${OptionNames.NAME}\` gleich an`;
    } catch (error) {
        return errorHandler('setBisForUser', error);
    }
};

/**
 * @description update Bis from user, set isMain
 * @param bis_name
 * @param user_id
 * @param guild_id string
 * @returns Promise<string>
 */
export const setMainBis = async (
    bis_name: string,
    user_id: string,
    guild_id: string
): Promise<string> => {
    try {
        const setFalseQuery: QueryConfig = {
            name: 'set-isMain',
            text: `UPDATE bis SET is_main=$1 WHERE user_id=$2 AND guild_id=$3;`,
            values: [false, user_id, guild_id]
        };

        await runQuery(setFalseQuery);

        const setTrueQuery: QueryConfig = {
            name: 'set-isMain',
            text: `UPDATE bis SET is_main=$1 WHERE bis_name=$2 AND user_id=$3 AND guild_id=$4;`,
            values: [true, bis_name, user_id, guild_id]
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

/**
 * @description set MainBis Gear in Overview for User
 * @param userId string
 * @param gearType string
 * @param guild_id string
 * @returns Promise<BisLinksType | null>
 */
export const setMainBisGearByUser = async (
    userId: string,
    gearType: string,
    guild_id: string
): Promise<BisLinksType | null> => {
    try {
        const query: QueryConfig = {
            name: 'set-MainBisGearByUser',
            text: `UPDATE bis SET ${gearType} = NOT ${gearType}  WHERE user_id=$1 AND guild_id=$2 AND is_main=true;`,
            values: [userId, guild_id]
        };

        const res = await runQuery(query);
        logger.info(`set-MainBisGearByUser ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description update Bis from user, set gear is looted or not
 * @param bis_name string
 * @param user_Id string
 * @param bis_message_id string
 * @param guild_id string
 * @returns  Promise<void>
 */
export const setBisMessageIdByUser = async (
    bis_name: string,
    user_Id: string,
    bis_message_id: string,
    guild_id: string
): Promise<void> => {
    try {
        const query: QueryConfig = {
            name: 'set-BisMessageIdFromUser',
            text: `UPDATE bis SET bis_message_id=$1 WHERE bis_name=$2 AND user_id=$3 AND guild_id=$4; `,
            values: [bis_message_id, bis_name, user_Id, guild_id]
        };

        await runQuery(query);
        logger.info(`set-BisMessageIdFromUser`);
    } catch (error) {
        errorHandler('set-BisMessageIdFromUser', error);
        return Promise.reject('set-BisMessageIdFromUser');
    }
};
