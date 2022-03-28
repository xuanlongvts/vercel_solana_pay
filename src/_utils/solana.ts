import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    TransactionInstruction,
    TransactionSignature,
    AccountInfo,
} from '@solana/web3.js';

import { WalletContextState } from '@solana/wallet-adapter-react';

import ENV, { ENUM_envName, getConfig } from '_config';

const getUrl = getConfig(ENV ?? ENUM_envName.dev);
// const wallet = new Wallet('https://www.sollet.io', getUrl);
// export const connection = new Connection(getUrl, 'confirmed');

const cluster = 'https://api.devnet.solana.com';
export const connection = new Connection(cluster, 'confirmed');

export const setPayerAndBlockhashTransaction = async (
    instructions: TransactionInstruction[],
    wallet: WalletContextState,
): Promise<Transaction> => {
    const transaction = new Transaction();
    instructions.forEach(ele => {
        transaction.add(ele);
    });
    if (wallet.publicKey) {
        transaction.feePayer = wallet.publicKey;
    }

    const hash = await connection.getRecentBlockhash();

    if (hash.blockhash) {
        transaction.recentBlockhash = hash.blockhash;
    }
    return transaction;
};

export const signAndSendTransaction = async (
    transaction: Transaction,
    wallet: WalletContextState,
): Promise<TransactionSignature> => {
    try {
        const signedTrans = wallet.signTransaction && (await wallet.signTransaction(transaction));
        const signature = await connection.sendRawTransaction(signedTrans!.serialize());
        return signature;
    } catch (err) {
        console.log('signAndSendTransaction error', err);
        throw err;
    }
};
