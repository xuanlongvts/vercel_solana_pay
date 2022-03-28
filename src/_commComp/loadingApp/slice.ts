import { createSlice, useInjectReducer } from '_redux';
import { NSP_LOADING_APP } from '_types/root_state_type';

import { T_APP_LOADING, KEY_IS_LOADING } from './types';

export const initialState: T_APP_LOADING = {
    [KEY_IS_LOADING]: false,
};

const slice = createSlice({
    name: NSP_LOADING_APP,
    initialState,
    reducers: {
        loadingOpen(state) {
            state[KEY_IS_LOADING] = true;
        },
        loadingClose(state) {
            state[KEY_IS_LOADING] = false;
        },
    },
});

export const { actions: appLoadingActions, reducer } = slice;

export const useAppLoadingSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};
