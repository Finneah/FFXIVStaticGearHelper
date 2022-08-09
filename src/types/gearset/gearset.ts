import {Equipment} from '../equip/equip';

export type MateriaType = {
    '1': number;
    '2': number;
    '3'?: number;
    '4'?: number;
    '5'?: number;
    '6'?: number;
};

export interface BaseGearset {
    id: string;
    jobAbbrev: string;
    name: string;
}
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
    materia: {[key: string]: MateriaType};
}

export interface Gearset extends BaseGearset {
    weapon?: Equipment;
    head?: Equipment;
    body?: Equipment;
    hands?: Equipment;
    legs?: Equipment;
    feet?: Equipment;
    offHand?: Equipment | null;
    ears?: Equipment;
    neck?: Equipment;
    wrists?: Equipment;
    fingerL?: Equipment;
    fingerR?: Equipment;
    food: number;
    materia: {[key: string]: MateriaType};
}
