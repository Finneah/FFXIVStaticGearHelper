import { createSlice } from '@reduxjs/toolkit';

import { baseSliceErrorReducer, baseSliceFulfilledSplice, baseSliceLoadingReducer } from '../base.reducers';
import { fetchJobs } from './jobs.actions';
import { JobsSliceState } from './jobs.types';

const initialState: JobsSliceState = {
    data: [],
    loading: false,
    error: null
};

export const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetchJobList
        builder.addCase(fetchJobs.fulfilled, (state, action) => {
            const jobs = action.payload;
            if (jobs) {
                state.data = jobs;
            }

            baseSliceFulfilledSplice(state);
        });
        builder.addCase(fetchJobs.pending, baseSliceLoadingReducer);
        builder.addCase(fetchJobs.rejected, baseSliceErrorReducer);
    }
});
