import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { createQROptions } from '@solana/pay';
import QRCodeStyling from '@solana/qr-code-styling';
import { PublicKey } from '@solana/web3.js';

import { LocalStorageServices } from '_utils/localStorage';
import { WalletRecipient, DEVNET_DUMMY_MINT } from '_config';
import { ENUM_FIELDS } from '_validate';

const QRCode: FC<{ refPubkey: PublicKey }> = ({ refPubkey }) => {
    const matches = useMediaQuery('(max-width:450px)');

    const [url, setUrl] = useState<string>('');
    const [amountSol, setAmountSol] = useState<Number>();
    const [unitPayParse, setUnitPayParse] = useState<string>('SOL');

    useEffect(() => {
        const getAmount = Number(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        const getLabel = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.label));

        let url = `solana:${WalletRecipient}?amount=${getAmount}&reference=${refPubkey.toBase58()}`;
        getLabel && (url += `&label=${getLabel}`);

        const getUnitPay = Number(LocalStorageServices.getItemJson(ENUM_FIELDS.unitPay));
        if (getUnitPay === 2) {
            url += `&spl-token=${DEVNET_DUMMY_MINT}`;
            setUnitPayParse('USDC');
        }

        const getMessage = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.message));
        getMessage && (url += `&message=${getMessage}`);

        const getMemo = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.memo));
        getMemo && (url += `&memo=${getMemo}`);

        console.log('url genegrate: ', url);

        setUrl(url);
        setAmountSol(getAmount);
    }, []);

    const size = matches ? 320 : 400;
    const options = useMemo(() => createQROptions(url, size, 'transparent', '#2a2a2a'), [url, size]);

    const qr = useMemo(() => new QRCodeStyling(), []);
    useLayoutEffect(() => qr.update(options), [qr, options]);

    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (ref.current) {
            qr.append(ref.current);
        }
    }, [ref, qr]);

    return (
        <div className="geneQrCode">
            <p>
                <label>Recipient pubkey: </label>
                <code>{WalletRecipient}</code>
            </p>
            <p>
                <strong className="numSOL">{amountSol} </strong> {unitPayParse}
            </p>

            <div ref={ref} />
        </div>
    );
};

export default QRCode;
