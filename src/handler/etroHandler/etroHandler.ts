import axios from 'axios';
import {CommandInteraction, CacheType} from 'discord.js';

import {Equipment, EtroGearset, Gearset} from '../../types/gearset/gearset';
import {errorHandler} from '../errorHandler/errorHandler';

export const ETRO_API = 'https://etro.gg/api';

export const getEtroJobList = async () => {
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

export const getGearset = async (
    gearsetId: string,
    interaction?: CommandInteraction<CacheType>
): Promise<Gearset | undefined> => {
    try {
        const gearset: Gearset = await getGearsetWithEquipment();

        return gearset;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        errorHandler('getGearset', error, interaction);
        return undefined;
    }
    // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
};

const getEtroGearset = async (gearsetId: string) => {
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
                throw new Error(error);
            })
    );
};

const getGearsetWithEquipment = async () => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/
    const testId = 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831'; //'38fe3778-f2c1-4300-99e4-b58a0445e969'; //'e78a29e3-1dcf-4e53-bbcf-234f33b2c831';
    const etroGearset = await getEtroGearset(testId);
    const equipment = await getEquipmentAll(etroGearset);

    let gearset: Gearset = {
        id: etroGearset.id,
        jobAbbrev: etroGearset.jobAbbrev,
        name: etroGearset.name,
        weapon: equipment.find((e) => e.id === etroGearset.weapon),
        head: equipment.find((e) => e.id === etroGearset.head),
        body: equipment.find((e) => e.id === etroGearset.body),
        hands: equipment.find((e) => e.id === etroGearset.hands),
        legs: equipment.find((e) => e.id === etroGearset.legs),
        feet: equipment.find((e) => e.id === etroGearset.feet),
        offHand: equipment.find((e) => e.id === etroGearset.offHand),
        ears: equipment.find((e) => e.id === etroGearset.ears),
        neck: equipment.find((e) => e.id === etroGearset.neck),
        wrists: equipment.find((e) => e.id === etroGearset.wrists),
        fingerL: equipment.find((e) => e.id === etroGearset.fingerL),
        fingerR: equipment.find((e) => e.id === etroGearset.fingerR),
        food: etroGearset.food,
        materia: etroGearset.materia
    };
    gearset = await getGearSetWithMateria(gearset);

    return gearset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

const getEquipmentAll = async (gearset: EtroGearset): Promise<Equipment[]> => {
    const gearSet = [
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
    const equip = await Promise.all(gearSet.map(getEtroSingleEquipment));

    return equip;
};

const getEtroSingleEquipment = async (id: number) => {
    return (
        axios
            .get(ETRO_API + `/equipment/${id}/`)
            .then((response) => {
                return response.data;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                errorHandler('getSingleEquipment ' + id, error);
                return {success: false, data: ''};
            })
    );
};

const getEtroMateriaList = async () => {
    return (
        axios
            .get(ETRO_API + `/materia/`)
            .then((response) => {
                return response.data;
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                errorHandler('getEtroMateriaList ', error);
                return {success: false, data: ''};
            })
    );
};

const getGearSetWithMateria = async (gearset: Gearset): Promise<Gearset> => {
    try {
        const materiaList = await getEtroMateriaList();

        for (let i = 0; i < materiaList.length; i++) {
            const materiaListElement = materiaList[i];
            if (materiaListElement.id) {
                const keys = Object.keys(materiaListElement);

                let k: keyof typeof keys;
                for (k in keys) {
                    const key = keys[k];

                    for (const gMKey in gearset.materia) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                gearset.materia,
                                gMKey
                            )
                        ) {
                            if (materiaListElement[key].id) {
                                let gearsetmateriaString = JSON.stringify(
                                    gearset.materia[gMKey]
                                );
                                gearsetmateriaString =
                                    gearsetmateriaString.replaceAll(
                                        materiaListElement[key].id,
                                        JSON.stringify({
                                            type: materiaListElement.paramName,
                                            name: materiaListElement[key].name,
                                            value: materiaListElement[
                                                key + 'Value'
                                            ]
                                        })
                                    );
                                gearset.materia[gMKey] =
                                    JSON.parse(gearsetmateriaString);
                            }
                        }
                    }
                }
            }
        }

        return gearset;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
};
