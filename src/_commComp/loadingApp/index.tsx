import { memo } from 'react';
import { useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';

import { useAppLoadingSlice } from './slice';
import { selectLoading } from './selector';

const LoadingApp = () => {
    useAppLoadingSlice();

    const isLoading = useSelector(selectLoading);

    return (
        <Modal open={isLoading}>
            <LinearProgress color="secondary" variant="query" />
        </Modal>
    );
};

export default memo(LoadingApp);
