import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '../../config';
import {errorHandler} from '../../handler';
import {SGHJob} from './jobs.types';

export const fetchJobs = createAsyncThunk(
    'jobs/fetch',
    async (): Promise<SGHJob[] | null> => {
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
