import axios from 'axios';
import {CommandInteraction, CacheType} from 'discord.js';
import {EquipType} from '../../types/equip';
import {GearsetType} from '../../types/gearset';
import {JobType} from '../../types/job';
import {errorHandler} from '../error/errorHandler';

export const ETRO_API = 'https://etro.gg/api';

export const getGearset = async (
    gearsetId: string,
    interaction?: CommandInteraction<CacheType>
): Promise<GearsetType> => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/
    const testId = 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831';
    // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
    return (
        axios
            .get(ETRO_API + `/gearsets/${gearsetId}/`)
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    return {success: false, data: ''};
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                errorHandler('getGearset', error, interaction);
                return {success: false, data: ''};
            })
    );
};

export const getJobList = async (): Promise<JobType[]> => {
    // https://etro.gg/api/jobs/

    return (
        axios
            .get(ETRO_API + `/jobs/`)
            .then((response) => {
                return response.data;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                errorHandler('getJobList', error);
                return {success: false, data: ''};
            })
    );
};

const getEquipment = async (id: number): Promise<EquipType> => {
    return (
        axios
            .get(ETRO_API + `/equipment/${id}/`)
            .then((response) => {
                return response.data;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                errorHandler('getEquipment', error);
                return {success: false, data: ''};
            })
    );
};

export const getEquipmentAll = async (
    gearset: GearsetType
): Promise<EquipType[]> => {
    const gearSet: number[] = [
        gearset.weapon,
        gearset.head,
        gearset.body,
        gearset.hands,
        gearset.legs,
        gearset.feet,
        gearset.ears,
        gearset.neck,
        gearset.wrists,
        gearset.fingerL,
        gearset.fingerR
    ];
    if (gearset.offHand) {
        gearSet.push(gearset.offHand);
    }
    const equip = await Promise.all(gearSet.map(getEquipment));

    return equip;
};
