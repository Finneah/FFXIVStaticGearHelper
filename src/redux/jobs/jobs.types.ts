import {BaseSliceState} from '../base.types';

export interface SGHJob {
    id: number;
    abbrev: string;
    name: string;
    iconPath: string;
}

export type JobsSliceState = BaseSliceState<SGHJob[]>;
