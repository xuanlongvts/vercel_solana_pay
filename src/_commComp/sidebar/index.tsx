import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import NoSsr from '@mui/material/NoSsr';

import List from '@mui/material/List';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { darkThemeModes } from 'themes/const';
import navConfig from './consts';

const SwitchThemeMode = dynamic(() => import('themes/darkMode'), { ssr: false });

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        order: {
            width: 25,
            height: 25,
            borderRadius: '50%',
            minWidth: 25,
            marginRight: theme.spacing(1),
            border: `1px solid ${theme.palette.primary.contrastText}`,
            lineHeight: '23px',
            textAlign: 'center',
            color: theme.palette.secondary.contrastText,
            display: 'inline-block',
        },
        linkLogo: {
            '& a': {
                cursor: 'pointer',
                textDecoration: 'none',
                color:
                    theme.palette.mode === darkThemeModes.dark
                        ? theme.palette.primary.dark
                        : theme.palette.secondary.contrastText,
            },
        },
    }),
);

const ListItemLink = (props: ListItemProps<'a', { button?: true }>) => <ListItem button component="a" {...props} />;

const Sidebar = () => {
    const classes = useStyles();
    const router = useRouter();

    const handleClickLink = (href: string) => {
        router.push(href);
    };

    return (
        <aside>
            <NoSsr>
                <Typography variant="h4" align="center" gutterBottom className={classes.linkLogo}>
                    <Link href="/">Streaming Protocol</Link>
                </Typography>

                <Divider />

                <List component="nav" aria-label="Nav">
                    {navConfig.map((i, k) => {
                        return (
                            <ListItemLink
                                selected={router.pathname === i.link}
                                key={k}
                                onClick={() => handleClickLink(i.link)}
                            >
                                <ListItemIcon>{k + 1}</ListItemIcon>

                                <ListItemText primary={i.title} />
                            </ListItemLink>
                        );
                    })}
                </List>
                <SwitchThemeMode />
            </NoSsr>
        </aside>
    );
};

export default Sidebar;
