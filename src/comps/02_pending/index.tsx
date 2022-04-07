import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NoSsr from '@mui/material/NoSsr';

import {
    createTransaction,
    findTransactionSignature,
    FindTransactionSignatureError,
    validateTransactionSignature,
    ValidateTransactionSignatureError,
} from '@solana/pay';
import { ConfirmedSignatureInfo, Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BigNumber from 'bignumber.js';

import Header from '_commComp/header';
import { PubkeyRecipient, PaymentStatus, WalletRecipient, requiredConfirmations, Confirmations, PROGRESS_STATUS } from '_config';
import { LocalStorageServices } from '_utils/localStorage';
import { ENUM_FIELDS } from '_validate';

import QRCode from './qr_code';
import Progress from './progress';

const Pending = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const router = useRouter();

    const reRefreshKey = Keypair.generate().publicKey; // Important for reference receiver transaction confirmed

    const [signature, setSignature] = useState<TransactionSignature>();
    const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
    const [reference, setReference] = useState<PublicKey>(reRefreshKey);
    const [confirmations, setConfirmations] = useState<Confirmations>(0);
    const [qrCodeValid, setQrCodeValid] = useState<boolean>(false);

    const progress = useMemo(() => confirmations / requiredConfirmations, [confirmations]);

    // console.log('reference: ---> ', reference.toBase58());

    // F5 Browswer
    useEffect(() => {
        const getAmount = Number(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        const getLabel = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.label));
        const getInforProgress = LocalStorageServices.getItemJson(PROGRESS_STATUS.ProgressStatus);
        if (getAmount && getLabel) {
            setQrCodeValid(true);
        } else if (!getInforProgress) {
            router.push('/');
        }

        return () => {
            LocalStorageServices.removeAll();
        };
    }, []);

    // 0. Wallet Pay on Browser
    useEffect(() => {
        if (publicKey && status === PaymentStatus.Pending) {
            let changed = false;

            const run = async () => {
                try {
                    const getAmount = new BigNumber(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
                    const getLabel = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.label));
                    const getMemo = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.memo));

                    if (!getAmount || !getLabel) {
                        router.push('/');
                    }

                    const splToken = undefined;
                    const transaction = await createTransaction(connection, publicKey, PubkeyRecipient, getAmount, {
                        splToken,
                        reference,
                        memo: getMemo,
                    });
                    if (!changed) {
                        await sendTransaction(transaction, connection);
                    }
                } catch (err) {
                    console.log('0. Wallet on Broswer Pay --->: ', err);
                    timeout = setTimeout(run, 3000);
                }
            };
            let timeout = setTimeout(run, 0);

            return () => {
                LocalStorageServices.removeAll();
                changed = true;
                clearTimeout(timeout);
            };
        }
    }, [status, publicKey, sendTransaction]);

    // 1. Status pending
    useEffect(() => {
        if (signature || status !== PaymentStatus.Pending || !reference) {
            return;
        }

        let changed = false;
        const interval = setInterval(async () => {
            let signature: ConfirmedSignatureInfo;
            try {
                signature = await findTransactionSignature(connection, reference, undefined, 'confirmed');

                console.log('signature: ---> ', signature);

                if (!changed) {
                    clearInterval(interval);
                    setSignature(signature.signature);
                    setStatus(PaymentStatus.Confirmed);

                    LocalStorageServices.removeManyItems([
                        ENUM_FIELDS.amount,
                        ENUM_FIELDS.label,
                        ENUM_FIELDS.message,
                        ENUM_FIELDS.memo,
                        ENUM_FIELDS.unitPay,
                    ]);
                }
            } catch (err: any) {
                // If the RPC node doesn't have the transaction signature yet, try again
                if (!(err instanceof FindTransactionSignatureError)) {
                    console.log('1. Error: ', err);
                }
            }
        }, 300);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, reference, connection]);

    // 2. Status confirmed, check valid informations again
    useEffect(() => {
        const getAmount = new BigNumber(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        if (!signature || status !== PaymentStatus.Confirmed || !getAmount) {
            return;
        }
        let changed = false;
        let timeout: any;

        const run = async () => {
            try {
                // splToken (later version)
                await validateTransactionSignature(connection, signature, PubkeyRecipient, getAmount, undefined, reference, 'confirmed');
                if (!changed) {
                    // console.log('status: ', status);
                    setStatus(PaymentStatus.Valid);
                    changed = true;
                }
            } catch (err: any) {
                if (err instanceof ValidateTransactionSignatureError && (err.message === 'not found' || err.message === 'missing meta')) {
                    console.warn('2.0 Error validate: ', err);
                    timeout = setTimeout(run, 50);
                    return;
                }

                console.warn('2.1 Validate --->>> Error: ', err);
                setStatus(PaymentStatus.InValid);
                LocalStorageServices.removeAll();

                router.push('/');
            }
        };
        timeout = setTimeout(run, 0);

        return () => {
            clearTimeout(timeout);
            changed = true;
        };
    }, [status, signature, reference, connection]);

    // 3. Status valid, poll for confirmations until the transaction is finalized
    useEffect(() => {
        if (!signature || status !== PaymentStatus.Valid) {
            return;
        }
        let changed = false;

        const interval = setInterval(async () => {
            try {
                const response = await connection.getSignatureStatus(signature);

                const status = response.value;
                // console.log('status: ---> ', status);
                if (!status) {
                    return;
                }
                if (status.err) {
                    throw status.err;
                }

                if (!changed) {
                    const confirmations = (status.confirmations || 0) as Confirmations;
                    setConfirmations(confirmations);

                    if (confirmations >= requiredConfirmations || status.confirmationStatus === 'finalized') {
                        clearInterval(interval);
                        setStatus(PaymentStatus.Finalized);

                        changed = true;
                        LocalStorageServices.removeManyItems([
                            ENUM_FIELDS.amount,
                            ENUM_FIELDS.label,
                            ENUM_FIELDS.message,
                            ENUM_FIELDS.memo,
                            ENUM_FIELDS.unitPay,
                        ]);
                    }
                }
            } catch (err: any) {
                console.warn('3. Consensus --->>> Error: ', err);
            }
        }, 100);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, connection]);

    return (
        <NoSsr>
            <Header />
            <section>
                {status === PaymentStatus.Pending && qrCodeValid ? (
                    <QRCode refPubkey={reference} />
                ) : (
                    <Progress status={status} progress={progress} />
                )}
            </section>
        </NoSsr>
    );
};

export default Pending;
