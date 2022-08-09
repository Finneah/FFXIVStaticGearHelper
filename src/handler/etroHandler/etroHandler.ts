import axios from 'axios';
import {CommandInteraction, CacheType} from 'discord.js';
import {Equipment} from '../../types/equip/equip';
import {EtroGearset, Gearset, MateriaType} from '../../types/gearset/gearset';
import {JobType} from '../../types/job/job';
import {errorHandler} from '../errorHandler/errorHandler';

export const ETRO_API = 'https://etro.gg/api';

export const getGearset = async (
    gearsetId: string,
    interaction?: CommandInteraction<CacheType>
): Promise<Gearset> => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/
    const testId = 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831'; //'38fe3778-f2c1-4300-99e4-b58a0445e969'; //'e78a29e3-1dcf-4e53-bbcf-234f33b2c831';
    // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
    const etroGearset: EtroGearset = await getEtroGearset(testId, interaction);
    const materiaList = await getEtroMateriaList();

    let gearset: Gearset = await getGearsetWithEquipment(etroGearset);

    gearset = getGearSetWithMateria(gearset, materiaList);
    return gearset;
};

const getEtroGearset = async (
    gearsetId: string,
    interaction?: CommandInteraction<CacheType>
): Promise<EtroGearset> => {
    // https://etro.gg/api/gearsets/e78a29e3-1dcf-4e53-bbcf-234f33b2c831/
    const testId = 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831'; //'38fe3778-f2c1-4300-99e4-b58a0445e969'; //'e78a29e3-1dcf-4e53-bbcf-234f33b2c831';
    // TODO Fehler beheben wenn link mitgegeben wird, response passt dann auch nicht
    return (
        axios
            .get(ETRO_API + `/gearsets/${testId}/`)
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

const getGearsetWithEquipment = async (
    gearset: EtroGearset
): Promise<Gearset> => {
    const equipment = await getEquipmentAll(gearset);

    const set: Gearset = {
        id: gearset.id,
        jobAbbrev: gearset.jobAbbrev,
        name: gearset.name,
        weapon: equipment.find((e) => e.id === gearset.weapon),
        head: equipment.find((e) => e.id === gearset.head),
        body: equipment.find((e) => e.id === gearset.body),
        hands: equipment.find((e) => e.id === gearset.hands),
        legs: equipment.find((e) => e.id === gearset.legs),
        feet: equipment.find((e) => e.id === gearset.feet),
        offHand: equipment.find((e) => e.id === gearset.offHand),
        ears: equipment.find((e) => e.id === gearset.ears),
        neck: equipment.find((e) => e.id === gearset.neck),
        wrists: equipment.find((e) => e.id === gearset.wrists),
        fingerL: equipment.find((e) => e.id === gearset.fingerL),
        fingerR: equipment.find((e) => e.id === gearset.fingerR),
        food: gearset.food,
        materia: gearset.materia
    };

    return set;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

const getEquipmentAll = async (gearset: EtroGearset): Promise<Equipment[]> => {
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
    const equip: Equipment[] = await Promise.all(
        gearSet.map(getSingleEquipment)
    );

    return equip;
};
const getSingleEquipment = async (id: number): Promise<Equipment> => {
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

const getEtroMateriaList = async (): Promise<MateriaType> => {
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
function getGearSetWithMateria(gearset: Gearset, materiaList: any): Gearset {
    /**
     * 
const materiaList = [
    {
        id: 20,
        param: 10,
        paramName: 'GP',

        tier10: {
            id: 33937,
            name: "Gatherer's Grasp Materia X",
            description:
                'Cannot be melded onto a piece of equipment past the first advanced materia melding slot.',
            advancedMelding: true,
            canBeHq: false,
            iconId: 20288,
            iconPath: '/i/020000/020288.png',
            itemLevel: 560,
            itemUICategory: 58,
            level: 1,
            materiaSlotCount: 0,
            materializeType: 0,
            rarity: 1,
            unique: false,
            untradable: false
        },
        tier10Value: 10
    }
];
     */
    const gear = {
        weapon: gearset.weapon,
        head: gearset.head,
        body: gearset.body,
        hands: gearset.hands,
        legs: gearset.legs,
        feet: gearset.feet,
        offHand: gearset.offHand,
        ears: gearset.ears,
        neck: gearset.neck,
        wrists: gearset.wrists,
        fingerL: gearset.fingerL,
        fingerR: gearset.fingerR
    };

    console.log('DEBUG', gearset.weapon);

    const weaponId = gearset.weapon?.id;
    if (weaponId) {
        console.log('DEBUG', gearset.materia[weaponId]);
    }

    return gearset;
}

const getMateriaForGear = async (materias: {[key: string]: string}) => {
    // const gearSet: number[] = [
    //     gearset.weapon,
    //     gearset.head,
    //     gearset.body,
    //     gearset.hands,
    //     gearset.legs,
    //     gearset.feet,
    //     gearset.ears,
    //     gearset.neck,
    //     gearset.wrists,
    //     gearset.fingerL,
    //     gearset.fingerR
    // ];
    // if (gearset.offHand) {
    //     gearSet.push(gearset.offHand);
    // }
    // const filledMaterias = await Promise.all(materias.map(getSingleMateria));

    return materias;
};
const getSingleMateria = async (id: string): Promise<Equipment> => {
    return (
        axios
            .get(ETRO_API + `/materia/${id}/`)
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
