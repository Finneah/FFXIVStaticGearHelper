import axios from 'axios';
export const ETRO_API = 'https://etro.gg/api';

export const getGearset = async (id: string) => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/
    const testId = 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831';
    const response = await axios.get(ETRO_API + `/gearsets/${testId}/`);
    return response.data;
};

export const getJobList = async () => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/

    const response = await axios.get(ETRO_API + `/jobs/`);
    return response.data;
};

interface BaseResponse {
    status: string;
}

export interface GetEquipment extends BaseResponse {
    value: {
        id: number;
        name: string;
        slotName: string;
    };
}
const getEquipment = async (id: string): Promise<GetEquipment> => {
    return axios
        .get(ETRO_API + `/equipment/${id}/`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error.message);
            return {success: false, value: ''};
        });
};

export const getEquipmentAll = async (gearset: string[]) => {
    const equip = await Promise.allSettled(gearset.map(getEquipment));

    return equip;
};
