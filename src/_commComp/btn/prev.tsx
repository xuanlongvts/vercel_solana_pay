import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import ArrowLeft from '@mui/icons-material/ArrowLeft';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            background: 'linear-gradient(253deg,#DC1FFF,#00FFA3)',
            textTransform: 'initial',
        },
    }),
);
type T_Btn = {
    href: string;
};
const PREV = ({ href }: T_Btn) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            className={classes.root}
            startIcon={<ArrowLeft fontSize="inherit" />}
        >
            Prev step
        </Button>
    );
};

export default PREV;
