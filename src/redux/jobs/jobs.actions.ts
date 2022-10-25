import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { errorHandler } from '../../handler';
import { Job } from '../../types/job';

export const fetchJobs = createAsyncThunk(
    'jobs/fetch',
    async (): Promise<Job[] | null> => {
        return axios
            .get(API_URL + `/jobs/`)
            .then((response) => {
                return response.data;
            })

            .catch((error) => {
                errorHandler('getJobs', error);
                return {success: false, data: ''};
            });
    }
);
