import { EntityState } from '@reduxjs/toolkit';

import { Guild } from '../../types/guild';
import { BaseProjectEntity } from '../base.types';

export interface GuildsEntity extends BaseProjectEntity<Guild> {
    data: Guild;
}

export interface GuildsSliceState extends EntityState<GuildsEntity> {
    loading: false;
    error: null;
}

export type GetGuildResponse = {
    success: boolean;
    data?: Guild;
};

export type GetGuildsResponse = {
    success: boolean;
    data?: Guild[];
};
