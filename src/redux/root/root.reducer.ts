import {combineReducers} from '@reduxjs/toolkit';
import {guildsSlice} from '../guilds/guildsSlice';
import {jobsSlice} from '../jobs/jobs.slice';

/* ------------- Assemble The Reducers ------------- */
export const rootReducer = combineReducers({
    guilds: guildsSlice.reducer,
    jobs: jobsSlice.reducer
});
