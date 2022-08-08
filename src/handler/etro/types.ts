import {EquipType} from '../../types/equip';
import {GearsetType} from '../../types/gearset';
import {JobType} from '../../types/job';

interface BaseResponse {
    status: string;
}

export interface GetGearset extends BaseResponse {
    data: GearsetType;
}

export interface GetEquipment extends BaseResponse {
    data: EquipType;
}

export interface GetJobs extends BaseResponse {
    data: JobType;
}
