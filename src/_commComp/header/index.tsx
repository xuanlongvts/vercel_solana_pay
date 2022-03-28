import { useCallback } from 'react';
import { useRouter } from 'next/router';

// import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';

// const SwitchThemeMode = dynamic(() => import('themes/darkMode'), { ssr: false });
import { LocalStorageServices } from '_utils/localStorage';

const Header = ({ noBack }: { noBack?: boolean | null }) => {
    const router = useRouter();
    const matches = useMediaQuery('(max-width:450px)');

    const hanldeOnBack = useCallback(() => {
        router.push('/');
        LocalStorageServices.removeAll();
    }, []);

    return (
        <header className={noBack ? 'noBack' : ''}>
            {!noBack ? (
                <span className="back" onClick={hanldeOnBack}>
                    <ArrowLeftIcon /> Back
                </span>
            ) : null}

            <Link href="/">
                <a className="logo">
                    <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={100} height={50} />
                </a>
            </Link>

            {!matches ? <WalletMultiButton /> : null}
            {/* <SwitchThemeMode /> */}
        </header>
    );
};

export default Header;
