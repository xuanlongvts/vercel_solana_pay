import { ThemeState } from 'themes/const';

export const NSP_LOADING_APP = 'NSP_LOADING_APP';
import { T_APP_LOADING } from '_commComp/loadingApp/types';

export const NSP_THEME_MODE_MODE_THEME = 'NSP_THEME_MODE_MODE_THEME';
import { T_DARK_MODE } from 'themes/darkMode/slice/types';

export const NSP_SENDING = 'NSP_SENDING';

export interface RootState {
    theme: ThemeState;
    [NSP_LOADING_APP]: T_APP_LOADING;
    [NSP_THEME_MODE_MODE_THEME]?: T_DARK_MODE;
}
