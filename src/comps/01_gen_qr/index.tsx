import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Header from '_commComp/header';
import { WalletRecipient } from '_config';
import { LocalStorageServices } from '_utils/localStorage';
import FundAccSchema, { T_HOOKS_FOMR_GENE_QR_CODE, ENUM_FIELDS } from '_validate';
import { appLoadingActions } from '_commComp/loadingApp/slice';

const GenerateQr = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_GENE_QR_CODE>({
        mode: 'onBlur',
        resolver: yupResolver(FundAccSchema),
    });

    const onSubmitForm = (data: T_HOOKS_FOMR_GENE_QR_CODE) => {
        dispatch(appLoadingActions.loadingOpen());

        LocalStorageServices.setItemJson(ENUM_FIELDS.label, data[ENUM_FIELDS.label]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.amount, data[ENUM_FIELDS.amount]);

        data[ENUM_FIELDS.message] && LocalStorageServices.setItemJson(ENUM_FIELDS.message, data[ENUM_FIELDS.message]);
        data[ENUM_FIELDS.memo] && LocalStorageServices.setItemJson(ENUM_FIELDS.memo, data[ENUM_FIELDS.memo]);

        // http://localhost:1234?recipient=8vnGQag2cPzm71URQRegJ6eKbnrPvtJ8W7Vq9BYYSGrT&label=Long+Le+pay&amount=1&message=Thanks%20for%20all%20the%20fish&memo=OrderId1234

        // const url = `?recipient=${WalletRecipient}&label=${data[ENUM_FIELDS.label]}&amount=${data[ENUM_FIELDS.amount]}&message=${
        //     data[ENUM_FIELDS.message]
        // }&memo=${data[ENUM_FIELDS.memo]}`;

        // router.push(`/02-pending${url}`);

        router.push('/02-pending');
    };

    const disabledBtn = !!(
        errors[ENUM_FIELDS.label] ||
        errors[ENUM_FIELDS.amount] ||
        !watch()[ENUM_FIELDS.label] ||
        !watch()[ENUM_FIELDS.amount]
    );

    return (
        <>
            <Header noBack />
            <section className="geneQrCode">
                <p>
                    <label>Recipient pubkey: </label>
                    <code>{WalletRecipient}</code>
                </p>
                <p>
                    <label>Environment: </label>
                    <strong>Dev net on Solana</strong>
                </p>

                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    id={ENUM_FIELDS.label}
                    label="Lable"
                    placeholder="xxx"
                    type="text"
                    margin="normal"
                    {...register(ENUM_FIELDS.label)}
                    error={!!errors[ENUM_FIELDS.label]}
                    helperText={errors[ENUM_FIELDS.label]?.message}
                />
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    id={ENUM_FIELDS.amount}
                    label="Amount SOL"
                    placeholder="1"
                    type="text"
                    margin="normal"
                    {...register(ENUM_FIELDS.amount)}
                    error={!!errors[ENUM_FIELDS.amount]}
                    helperText={errors[ENUM_FIELDS.amount]?.message}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    id={ENUM_FIELDS.message}
                    label="Mesage"
                    placeholder="Abc"
                    type="text"
                    margin="normal"
                    {...register(ENUM_FIELDS.message)}
                    error={!!errors[ENUM_FIELDS.message]}
                    helperText={errors[ENUM_FIELDS.message]?.message}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    id={ENUM_FIELDS.memo}
                    label="Memo"
                    placeholder="Memo"
                    type="text"
                    margin="normal"
                    {...register(ENUM_FIELDS.memo)}
                    error={!!errors[ENUM_FIELDS.memo]}
                    helperText={errors[ENUM_FIELDS.memo]?.message}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    style={{ textTransform: 'initial' }}
                    disabled={disabledBtn}
                    onClick={handleSubmit(onSubmitForm)}
                >
                    Generate Payment Code
                </Button>
            </section>
        </>
    );
};

export default GenerateQr;
