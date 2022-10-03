import {EntityState} from '@reduxjs/toolkit';
import {DBUser} from '../../api/database/types/DBTypes';
import {BaseEquipment} from '../../model/BaseEquipment';
import {BaseGearset} from '../../model/Gearset';
import {BaseGuild} from '../../model/Guild';
import {EtroFood} from '../../types';

import {BaseProjectEntity} from '../base.types';

export interface SGHEquipment extends BaseEquipment {
    looted?: boolean;
}

export interface SGHGearset extends BaseGearset {
    isMain?: boolean;
    weapon?: SGHEquipment;
    head?: SGHEquipment;
    body?: SGHEquipment;
    hands?: SGHEquipment;
    legs?: SGHEquipment;
    feet?: SGHEquipment;
    offHand?: SGHEquipment | null;
    ears?: SGHEquipment;
    neck?: SGHEquipment;
    wrists?: SGHEquipment;
    fingerL?: SGHEquipment;
    fingerR?: SGHEquipment;
    food?: SGHFood;
}

export type SGHMateria = {
    type: string;
    name: string;
    value: number;
};

export type SGHFood = EtroFood;

export interface SGHUser extends DBUser {
    bis: SGHGearset[];
}
export interface SGHGuild extends BaseGuild {
    users?: SGHUser[];
}

export interface GuildsEntity extends BaseProjectEntity<SGHGuild> {
    data: SGHGuild;
}

export interface GuildsSliceState extends EntityState<GuildsEntity> {
    loading: false;
    error: null;
}
