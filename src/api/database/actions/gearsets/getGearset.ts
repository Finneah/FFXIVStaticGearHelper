import {QueryConfig} from 'pg';
import Logger from '../../../../logger';
import {EtroGearset} from '../../../../types';
import {runQuery} from '../../database';

const logger = Logger.child({module: 'getGearset'});
/**
 * @description get specific bis from User on slash command /bis get
 * @param userId string
 * @param bis_name string
 * @param guild_id string
 * @returns BisLinksType[]
 */
export const dbGetGearsetByLink = async (
    bis_link: string
): Promise<EtroGearset | null> => {
    try {
        const query: QueryConfig = {
            name: 'get-Gearset',
            text: 'SELECT * FROM gearsets WHERE bis_link=$1;',
            values: [bis_link]
        };

        const res = await runQuery(query);
        logger.info(`get-Gearset ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ? {...res?.rows[0], bisLink: bis_link} : null;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description get specific bis from User on slash command /bis get
 * @param userId string
 * @param bis_name string
 * @param guild_id string
 * @returns BisLinksType[]
 */
export const setGearset = async (
    gearset: EtroGearset
): Promise<EtroGearset | null> => {
    const {
        lastUpdate,
        bisLink,
        jobAbbrev,
        weapon,
        head,
        body,
        hands,
        legs,
        feet,
        offHand,
        ears,
        neck,
        wrists,
        fingerL,
        fingerR,
        food,
        materia
    } = gearset;
    try {
        const query: QueryConfig = {
            name: 'set-Gearset',
            text: `INSERT INTO gearset (
                last_update,
                bis_link, 
                jobAbbrev,
                weapon,
                head,
                body,
                hands,
                legs,
                feet,
                offHand,
                ears,
                neck,
                wrists,
                finger_l,
                finger_r,
                food,
                materia
            ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
            values: [
                lastUpdate,
                bisLink,
                jobAbbrev,
                weapon,
                head,
                body,
                hands,
                legs,
                feet,
                offHand,
                ears,
                neck,
                wrists,
                fingerL,
                fingerR,
                food,
                JSON.stringify(materia)
            ]
        };

        const res = await runQuery(query);
        logger.info(`set-Gearset ${JSON.stringify(res?.rows[0])}`);
        return res?.rows[0] ?? null;
    } catch (error) {
        return Promise.reject(error);
    }
};
