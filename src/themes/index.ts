import { createTheme, Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { darkThemeModes } from './const';

const Themes = (darkState: string): Theme =>
    createTheme({
        palette: {
            mode: darkState === darkThemeModes.dark ? darkThemeModes.dark : darkThemeModes.light,
            primary: {
                main: darkState === darkThemeModes.dark ? '#0276aa' : '#35baf6',
            },
            secondary: {
                main: darkState === darkThemeModes.dark ? '#00a0b2' : '#33eaff',
            },
            error: {
                main: red.A400,
            },
        },
    });

export default Themes;
