import {SGHGearset} from '../redux/guilds/guilds.types';
import {errorHandler} from '../handler';
import axios from 'axios';
import {API_URL} from '../config';

export class ApiHandler {
    // constructor() {}

    getGearset = async (link: string): Promise<SGHGearset | undefined> => {
        try {
            const id = link.replace('https://etro.gg/gearset/', '');

            return axios
                .get(API_URL + `/getgearset/${id}/`)
                .then((response) => {
                    if (response.status === 200) {
                        return response.data;
                    } else {
                        return {success: false, data: ''};
                    }
                })

                .catch((error) => {
                    errorHandler('getGearset', error);
                    return null;
                });
        } catch (error) {
            errorHandler('getGearset', error);
            return undefined;
        }
        // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
    };
}
