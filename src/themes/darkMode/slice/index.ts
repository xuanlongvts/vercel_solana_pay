import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import { NSP_THEME_MODE_MODE_THEME } from '_types/root_state_type';
import { createSlice, useInjectReducer } from '_redux';
import { darkThemeModes } from 'themes/const';
import { T_DARK_MODE } from './types';

export const initialState: T_DARK_MODE = {
    val: LocalStorageServices.getItem(LocalStorageKey().darkMode) || darkThemeModes.light,
};

const slice = createSlice({
    name: NSP_THEME_MODE_MODE_THEME,
    initialState,
    reducers: {
        changeDarkModeType(state) {
            const { val } = state;
            const newVal = val === darkThemeModes.light ? darkThemeModes.dark : darkThemeModes.light;
            state.val = newVal;

            LocalStorageServices.setItem(LocalStorageKey().darkMode, newVal);
        },
    },
});

export const { actions: darkModeTypeActions, reducer } = slice;

export const useDarkModeTypeSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};
