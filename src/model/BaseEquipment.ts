import {SlotNames} from '../api/database/types/DBTypes';
import {SGHMateria} from '../redux/guilds/guilds.types';

export type BaseEquipment = {
    id: number;
    equipment_name: string;
    slotName: SlotNames;
    materia_1?: SGHMateria;
    materia_2?: SGHMateria;
    materia_3?: SGHMateria;
    materia_4?: SGHMateria;
    materia_5?: SGHMateria;
};
