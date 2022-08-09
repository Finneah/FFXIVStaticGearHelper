export type Equipment = {
    id: number;
    name: string;
    materiaSlotCount: number;
    slotName: string;
    materia?: {index: string; id: string; name: string}[];
};
