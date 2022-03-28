import { createSelector } from '@reduxjs/toolkit';

import { NSP_LOADING_APP, RootState } from '_types/root_state_type';

import { initialState } from './slice';
import { KEY_IS_LOADING, T_APP_LOADING } from './types';

const selectAppLoading = (state: RootState) => state[NSP_LOADING_APP] || initialState;

export const selectLoading = createSelector(selectAppLoading, (i: T_APP_LOADING) => i[KEY_IS_LOADING]);
