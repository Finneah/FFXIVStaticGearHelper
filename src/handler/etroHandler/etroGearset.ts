import axios from 'axios';

import { GetGearsetResponse } from '../../redux/gearset/gearset.types';
import { Gearset } from '../../types';
import { buildUrl } from '../../utils/buildUrl';

export const getGearset = async (link: string): Promise<GetGearsetResponse> => {
    const etro_id = link.replace('https://etro.gg/gearset/', '');
    return axios
        .get<Gearset>(buildUrl('etrogearset', {etro_id}))
        .then((response) => {
            if (response.status !== 200) {
                return {success: false};
            }
            return {success: false, data: response.data};
        });
};
