import * as Yup from 'yup';

export enum ENUM_FIELDS {
    label = 'label',
    amount = 'amount',
    message = 'message',
    memo = 'memo',
    reference = 'reference',
}

export interface T_HOOKS_FOMR_GENE_QR_CODE {
    [ENUM_FIELDS.label]: string;
    [ENUM_FIELDS.amount]: number;
    [ENUM_FIELDS.message]: string;
    [ENUM_FIELDS.memo]: string;
}

const LBL_FILED = {
    min: 3,
    max: 60,
};
export const labelField = Yup.string()
    .min(LBL_FILED.min, `Lable min is ${LBL_FILED.min} characters`)
    .max(LBL_FILED.max, `Lable max is ${LBL_FILED.max} characters`)
    .required('Label required');

const AMOUNT_FILED = {
    min: 0.0005,
    max: 1000000, // 1_000_000
};
export const amountFiled = Yup.number()
    .min(AMOUNT_FILED.min, `Amount min is ${AMOUNT_FILED.min} SOL`)
    .max(AMOUNT_FILED.max, `Amount max is ${AMOUNT_FILED.max} SOLs`)
    .required('Amount required');

const MESSAGE_FILED = {
    min: 3,
    max: 60,
};
export const messageField = Yup.string()
    .nullable()
    .notRequired()
    .when(ENUM_FIELDS.message, {
        is: (value: string) => value?.length,
        then: rule => rule.min(MESSAGE_FILED.min).max(MESSAGE_FILED.max),
    });

const MEMO_FILED = {
    min: 3,
    max: 60,
};
export const memoField = Yup.string()
    .nullable()
    .notRequired()
    .when(ENUM_FIELDS.memo, {
        is: (value: string) => value?.length,
        then: rule => rule.min(MEMO_FILED.min).max(MEMO_FILED.max),
    });

const FundAccSchema = Yup.object().shape(
    {
        [ENUM_FIELDS.label]: labelField,
        [ENUM_FIELDS.amount]: amountFiled,
        [ENUM_FIELDS.message]: messageField,
        [ENUM_FIELDS.memo]: memoField,
    },
    [
        [ENUM_FIELDS.message, ENUM_FIELDS.message],
        [ENUM_FIELDS.memo, ENUM_FIELDS.memo],
    ],
);

export default FundAccSchema;
