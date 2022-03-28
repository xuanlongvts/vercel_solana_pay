import { useState, useEffect, FC, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';

import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';

import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '_styles/_index.scss';
import theme from 'themes';
import createEmotionCache from 'themes/createEmotionCache';
import { selectModeType } from 'themes/darkMode/slice/selector';
import { wrapperStore } from '_redux/configureStore';
import ENV, { ENUM_envName } from '_config';

import LoadingApp from '_commComp/loadingApp';
import { appLoadingActions } from '_commComp/loadingApp/slice';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

enum routerEvents {
    start = 'routeChangeStart',
    done = 'routeChangeComplete',
    err = 'routeChangeError',
}

type T_APP = {
    Component: FC;
    pageProps: any;
    emotionCache?: EmotionCache;
};
const App = (props: T_APP) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const dispatch = useDispatch();
    const darkState = useSelector(selectModeType);

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleHasLoading = () => setLoading(true);
    const handleHasNotLoading = () => setLoading(false);

    // --------------------- Wallet Start
    // Can be set to 'devnet', 'testnet', or 'mainnet'
    let network = WalletAdapterNetwork.Devnet;
    ENV === ENUM_envName.test && (network = WalletAdapterNetwork.Testnet);
    ENV === ENUM_envName.production && (network = WalletAdapterNetwork.Mainnet);

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network],
    );
    // --------------------- Wallet End

    useEffect(() => {
        Router.events.on(routerEvents.start, handleHasLoading);
        Router.events.on(routerEvents.done, handleHasNotLoading);
        Router.events.on(routerEvents.err, handleHasNotLoading);

        return () => {
            Router.events.off(routerEvents.start, handleHasLoading);
            Router.events.off(routerEvents.done, handleHasNotLoading);
            Router.events.off(routerEvents.err, handleHasNotLoading);
        };
    }, []);

    useEffect(() => {
        isLoading ? dispatch(appLoadingActions.loadingOpen()) : dispatch(appLoadingActions.loadingClose());
    }, [isLoading]);

    return (
        <CacheProvider value={emotionCache}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Head>
                            <title>Pay on Solana</title>
                            <meta name="viewport" content="initial-scale=1, width=device-width" />
                        </Head>
                        <ThemeProvider theme={theme(darkState)}>
                            <CssBaseline />

                            <main>
                                <Component {...pageProps} />
                            </main>
                            <LoadingApp />
                        </ThemeProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </CacheProvider>
    );
};

export default wrapperStore.withRedux(App);
