export enum darkThemeModes {
    light = 'light',
    dark = 'dark',
}

export type ThemeKeyType = keyof typeof darkThemeModes;

export interface ThemeState {
    selected: ThemeKeyType;
}
