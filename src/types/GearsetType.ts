import {BaseGearset} from '../model/Gearset';
import {SGHMateria} from '../redux/guilds/guilds.types';

export type MateriaType = {
    '1': SGHMateria;
    '2': SGHMateria;
    '3'?: SGHMateria;
    '4'?: SGHMateria;
    '5'?: SGHMateria;
    '6'?: SGHMateria;
};
export type EtroGearsetMateria = {[key: string]: number};
export interface EtroGearset extends BaseGearset {
    weapon: number;
    offHand: number | null;
    head: number;
    body: number;
    hands: number;
    legs: number;
    feet: number;
    ears: number;
    neck: number;
    wrists: number;
    fingerL: number;
    fingerR: number;
    food: number;
    materia: EtroGearsetMateria;
}

export type EtroMateriaTier = {
    [key: string]: {id: number; name: string}; //| string | number;
};
export interface EtroMateriaList {
    id: number;
    paramName: string;
}

export type EtroFood = {
    id: number;
    name: string;
    iconPath: string;
};

export type Gearset = {
    id: string;
    lastUpdate: string;
    bisLink: string;
    jobAbbrev: string;
    name: string;
    weapon?: EtroEquipment;
    head?: EtroEquipment;
    body?: EtroEquipment;
    hands?: EtroEquipment;
    legs?: EtroEquipment;
    feet?: EtroEquipment;
    offHand?: EtroEquipment | null;
    ears?: EtroEquipment;
    neck?: EtroEquipment;
    wrists?: EtroEquipment;
    fingerL?: EtroEquipment;
    fingerR?: EtroEquipment;
    food: {name: string; iconPath: string};
    materia: {[key: string]: MateriaType};
};

export type EtroEquipment = {
    id: number;
    name: string;
    materiaSlotCount: number;
    slotName: string;
    itemLevel: number;
    materia?: {index: string; id: string; name: string}[];
};
