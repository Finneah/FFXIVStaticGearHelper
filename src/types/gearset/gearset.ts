export type Materia = {
    type: string;
    name: string;
    value: number;
};
export type MateriaType = {
    '1': Materia;
    '2': Materia;
    '3'?: Materia;
    '4'?: Materia;
    '5'?: Materia;
    '6'?: Materia;
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
    materia: {[key: string]: number};
}

export type Gearset = {
    id: string;
    jobAbbrev: string;
    name: string;
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
};

export type Equipment = {
    id: number;
    name: string;
    materiaSlotCount: number;
    slotName: string;
    materia?: {index: string; id: string; name: string}[];
};
