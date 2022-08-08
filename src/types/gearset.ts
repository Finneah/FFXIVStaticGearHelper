export type MateriaType = {
    '1': number;
    '2': number;
    '3'?: number;
    '4'?: number;
    '5'?: number;
    '6'?: number;
};

export type GearsetType = {
    id: string;
    jobAbbrev: string;
    name: string;
    weapon: number;
    head: number;
    body: number;
    hands: number;
    legs: number;
    feet: number;
    offHand: number | null;
    ears: number;
    neck: number;
    wrists: number;
    fingerL: number;
    fingerR: number;
    food: number;
    materia: {[key: string]: MateriaType};
};
