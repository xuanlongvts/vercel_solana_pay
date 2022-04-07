import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import clsx from 'clsx';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

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

    const [unitPay, setUnitPay] = useState<number>(1);

    const handleUnitPay = (unit: number) => {
        unitPay !== unit && setUnitPay(unit);
        unitPay !== unit && resetField(ENUM_FIELDS.amount);
    };

    const {
        register,
        handleSubmit,
        watch,
        resetField,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_GENE_QR_CODE>({
        mode: 'onBlur',
        resolver: yupResolver(FundAccSchema(unitPay)),
    });

    const onSubmitForm = (data: T_HOOKS_FOMR_GENE_QR_CODE) => {
        dispatch(appLoadingActions.loadingOpen());

        LocalStorageServices.setItemJson(ENUM_FIELDS.label, data[ENUM_FIELDS.label]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.amount, data[ENUM_FIELDS.amount]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.unitPay, unitPay);

        data[ENUM_FIELDS.message] && LocalStorageServices.setItemJson(ENUM_FIELDS.message, data[ENUM_FIELDS.message]);
        data[ENUM_FIELDS.memo] && LocalStorageServices.setItemJson(ENUM_FIELDS.memo, data[ENUM_FIELDS.memo]);

        // http://localhost:1234?recipient=8vnGQag2cPzm71URQRegJ6eKbnrPvtJ8W7Vq9BYYSGrT&label=Long+Le+pay&amount=1&message=Thanks%20for%20all%20the%20fish&memo=OrderId1234

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
                    label={`Amount ${unitPay === 1 ? 'SOL' : 'USDC'}`}
                    placeholder="1"
                    type="text"
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" className={clsx('sol-usdc', unitPay === 1 ? 'sol' : 'usdc')}>
                                <Image
                                    src="/imgs/sol.svg"
                                    alt="Solana"
                                    width={32}
                                    height={32}
                                    onClick={() => handleUnitPay(1)}
                                    className="img_sol"
                                />
                                <Image
                                    src="/imgs/usdc.svg"
                                    alt="USDC"
                                    width={32}
                                    height={32}
                                    onClick={() => handleUnitPay(2)}
                                    className="img_usdc"
                                />
                            </InputAdornment>
                        ),
                    }}
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
