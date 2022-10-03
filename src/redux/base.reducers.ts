import {CaseReducer, AnyAction} from '@reduxjs/toolkit';
import Logger from '../logger';
import {BaseSliceState} from './base.types';

const logger = Logger.child({module: 'REDUX'});

export const baseSliceLoadingReducer: CaseReducer = <
    T extends BaseSliceState<T>
>(
    state: T
) => {
    state.loading = true;
    state.error = null;
};

export const baseSliceErrorReducer: CaseReducer = <
    T extends BaseSliceState<T>,
    A extends AnyAction
>(
    state: T,
    action: A
) => {
    if (action.error.code === '0') {
        logger.info('Request failed due to offline state, failing gracefully');
        // TODO: Put some logic here that shows the user he's in offline mode
    } else {
        logger.error('Redux-Store: Error being set to state', action.error);
        state.error = action.error;
    }

    state.loading = false;
};

export const baseSliceFulfilledSplice = (state: {
    loading: boolean;
    error: Error | null;
}) => {
    state.loading = false;
    state.error = null;
};
