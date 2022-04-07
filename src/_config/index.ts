import { PublicKey } from '@solana/web3.js';

const ENV = require('../../env.json').ENV;

export enum ENUM_envName {
    local = 'local',
    dev = 'dev',
    test = 'test',
    production = 'production',
}

export enum SOLANA_PROTOCOLS {
    API_SERVER = 'API_SERVER',
    HUB_RPC = 'HUB_RPC',
    HUB_WS = 'HUB_WS',
}

type T_envName = {
    local: string;
    dev: string;
    test: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.local]: 'local',
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.test]: 'qc',
    [ENUM_envName.production]: 'production',
};

export const Config = {
    [envName.local]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'http://127.0.0.1:8000',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
        [SOLANA_PROTOCOLS.HUB_WS]: '',
    },
    [envName.dev]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.devnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        [SOLANA_PROTOCOLS.HUB_WS]: 'wss://solana--devnet--ws.datahub.figment.io',
    },
    [envName.test]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.testnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
        [SOLANA_PROTOCOLS.HUB_WS]: '',
    },
    [envName.production]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.mainnet-beta.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        [SOLANA_PROTOCOLS.HUB_WS]: 'wss://solana--devnet--ws.datahub.figment.io',
    },
};

export type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Confirmations =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32;

export const WalletRecipient = 'BYaqcY4KvRkcjXTK8REEyWvs5FVajjdTRcoADAqVSULT'; // phantom wallet of recipient

export const PubkeyRecipient = new PublicKey(WalletRecipient); // transform to Pubkey

export const requiredConfirmations = 10;

export enum PaymentStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Valid = 'Valid',
    InValid = 'InValid',
    Finalized = 'Finalized',
}

export enum PROGRESS_STATUS {
    ProgressStatus = 'ProgressStatus',
}

// Mint DUMMY tokens on devnet @ https://spl-token-faucet.com
export const DEVNET_DUMMY_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
export const MAINNET_USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export const getConfig = (envParams = ENV, protocol = SOLANA_PROTOCOLS.API_SERVER) => {
    return Config[envParams as string][protocol];
};

export const accountExplorer = (address: string) => {
    let cluster = 'devnet';
    ENV === ENUM_envName.test && (cluster = 'testnet');
    ENV === ENUM_envName.production && (cluster = 'mainnet-beta');
    return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
};

export const transactionExplorer = (signature: string) => {
    let cluster = 'devnet';
    ENV === ENUM_envName.test && (cluster = 'testnet');
    ENV === ENUM_envName.production && (cluster = 'mainnet-beta');
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};

export default ENV;
