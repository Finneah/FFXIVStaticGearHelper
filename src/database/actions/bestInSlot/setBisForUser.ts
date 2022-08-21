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
 * @param interaction
 */
export const setBisForUser = async (
    bisLinkData: BisLinksType
): Promise<string> => {
    try {
        const query: QueryConfig = {
            name: 'set-BisForUser',
            text: 'INSERT INTO bis(user_id, bis_name,bis_link) VALUES($1, $2, $3);',
            values: [
                bisLinkData.user_id,
                bisLinkData.bis_name,
                bisLinkData.bis_link
            ]
        };

        const res = await runQuery(query);
        logger.info(`set-BisForUser ${JSON.stringify(res)}`);
        return `BiS ${bisLinkData.bis_name} Gespeichert. Schau es dir mit \`/${CommandNames.BESTINSLOT} ${SubCommandNames.GET} :${OptionNames.NAME}\` gleich an`;
    } catch (error) {
        return errorHandler('setBisForUser', error);
    }
};
