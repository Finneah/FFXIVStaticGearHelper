import {createEntityAdapter} from '@reduxjs/toolkit';
import {RootState} from '../root/root.types';
import {GuildsEntity} from './guilds.types';

export const guildsEntityAdapter = createEntityAdapter<GuildsEntity>({
    selectId: (project) => project.id,
    sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const guildsSelectors = guildsEntityAdapter.getSelectors<RootState>(
    (state) => state.guilds
);
