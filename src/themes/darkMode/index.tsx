import { useSelector, useDispatch } from 'react-redux';
import NoSsr from '@mui/material/NoSsr';
import Switch from '@mui/material/Switch';

import { DarkModeToggle } from 'react-dark-mode-toggle-2';

import { darkThemeModes } from '../const';
import { selectModeType } from './slice/selector';
import { useDarkModeTypeSlice } from './slice';

const DarkMode = () => {
    const { actions } = useDarkModeTypeSlice();
    const darkState = useSelector(selectModeType);

    const dispatch = useDispatch();

    const handleThemeChange = () => {
        dispatch(actions.changeDarkModeType());
    };

    return (
        <div className="togleTheme">
            <DarkModeToggle onChange={handleThemeChange} isDarkMode={darkState === darkThemeModes.dark} size={45} />
        </div>
    );
};

export default DarkMode;
