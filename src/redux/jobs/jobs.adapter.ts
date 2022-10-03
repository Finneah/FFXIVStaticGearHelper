import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../root/root.types';

export const jobsSelectors = createSelector(
    (state: RootState) => state.jobs,
    (jobsState) => jobsState
);
