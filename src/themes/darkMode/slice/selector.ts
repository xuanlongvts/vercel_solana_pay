import { createSelector } from '@reduxjs/toolkit';

import { NSP_THEME_MODE_MODE_THEME, RootState } from '_types/root_state_type';
import { initialState } from '.';

const selectDarkModeType = (state: RootState) => state[NSP_THEME_MODE_MODE_THEME] || initialState;

export const selectModeType = createSelector([selectDarkModeType], i => i.val);
