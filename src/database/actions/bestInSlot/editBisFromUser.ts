import {GearTypes} from '../../types/DataType';
import {SeqBiSLinks} from '../../sequelize';
import Logger from '../../../logger';
import {getBisByUserByName} from './getBisFromUser';
const logger = Logger.child({module: 'editGuildConfig'});
export const editBisFromUser = async (
    bis_name: string,
    user_Id: string,
    gearType: GearTypes
) => {
    const bis = await getBisByUserByName(user_Id, bis_name);

    const looted = bis[gearType] === true ? false : true;
    await SeqBiSLinks.update(
        {
            [gearType]: looted
        },
        {where: {user_id: user_Id}}
    );
    logger.info(`BIS chagned ${[gearType]} to  ${looted} is updated in DB`);
};
