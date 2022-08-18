import {SeqBiSLinks} from '../../sequelize';
import Logger from '../../../logger';
const logger = Logger.child({module: 'deleteBisFromUser'});
export const deleteBisFromUser = async (bis_name: string, user_Id: string) => {
    await SeqBiSLinks.destroy({where: {user_id: user_Id, bis_name: bis_name}});
    logger.info(`BIS ${bis_name} deleted in DB`);
};
