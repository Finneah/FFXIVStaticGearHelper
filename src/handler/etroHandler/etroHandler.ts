import axios from 'axios';
import {SubCommandNames} from '../../types';

import {
    Equipment,
    EtroGearset,
    Gearset
} from '../../types/GearsetType/GearsetType';
import {errorHandler} from '../errorHandler/errorHandler';

export const ETRO_API = 'https://etro.gg/api';

export const getEtroJobList = async () => {
    // https://etro.gg/api/jobs/

    return axios
        .get(ETRO_API + `/jobs/`)
        .then((response) => {
            return response.data;
        })

        .catch((error) => {
            errorHandler('getJobList', error);
            return {success: false, data: ''};
        });
};

export const getGearset = async (
    option: SubCommandNames.BY_ID | SubCommandNames.BY_LINK,
    idOrLink: string
): Promise<Gearset | undefined> => {
    try {
        let gearset: Gearset | undefined = await getGearsetWithEquipment(
            option,
            idOrLink
        );

        if (gearset) {
            gearset = await getGearSetWithMateria(gearset);
        }

        return gearset;
    } catch (error) {
        errorHandler('getGearset', error);
        return undefined;
    }
    // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
};

export const getGearsetWithEquipment = async (
    option: SubCommandNames.BY_ID | SubCommandNames.BY_LINK,
    idOrLink: string
): Promise<Gearset | undefined> => {
    try {
        // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/

        const etroGearset = await getEtroGearset(option, idOrLink);
        if (etroGearset) {
            const equipment = await getEquipmentAll(etroGearset);
            const etroFood = await getEtroFood(etroGearset.food);
            const gearset: Gearset = {
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
                food: etroFood,
                materia: etroGearset.materia
            };
            return gearset;
        }

        return undefined;
    } catch (error) {
        errorHandler('getGearsetWithEquipment', error);
        return undefined;
    }
};

const getEtroGearset = async (
    option: SubCommandNames.BY_ID | SubCommandNames.BY_LINK,
    idOrLink: string
) => {
    // https://etro.gg/gearset/38fe3778-f2c1-4300-99e4-b58a0445e969
    let id = idOrLink;
    if (option === SubCommandNames.BY_LINK) {
        id = idOrLink.replace('https://etro.gg/gearset/', '');
    }

    return axios
        .get(ETRO_API + `/gearsets/${id}/`)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                return {success: false, data: ''};
            }
        })

        .catch((error) => {
            errorHandler('getEtroGearset', error);
            return undefined;
        });
};

const getEtroFood = async (id: number) => {
    return axios
        .get(ETRO_API + `/food/${id}/`)
        .then((response) => {
            return response.data;
        })

        .catch((error) => {
            errorHandler('getEtroFood', error);
            return undefined;
        });
};

const getEtroSingleEquipment = async (id: number) => {
    return axios
        .get(ETRO_API + `/equipment/${id}/`)
        .then((response) => {
            return response.data;
        })

        .catch((error) => {
            errorHandler('getEtroSingleEquipment', error);
            return null;
        });
};

const getEtroMateriaList = async () => {
    return axios
        .get(ETRO_API + `/materia/`)
        .then((response) => {
            return response.data;
        })

        .catch((error) => {
            errorHandler('getEtroMateriaList', error);
            return null;
        });
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

const getGearSetWithMateria = async (
    gearset: Gearset
): Promise<Gearset | undefined> => {
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
    } catch (error) {
        errorHandler('getGearSetWithMateria', error);
        return undefined;
    }
};
