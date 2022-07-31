import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { JSONResponse, postWithData } from '../../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomError } from '../../../types';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { FormLabel } from '../../FormLabel';
import { AiOutlineClose } from 'react-icons/ai';

const formSchema = z.object({
    email: z.string().email({ message: 'email not properly formatted' }),
    password: z.string().min(1, 'password is required'),
});

type FormSchema = z.infer<typeof formSchema>;

async function loginUser(formData: FormSchema) {
    const response = await postWithData('api/auth/login', formData);
    const result: JSONResponse = await response.json();
    if (!response.ok) throw result;
    return result;
}

interface LoginFormProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export function LoginForm({ showDialog, setShowDialog }: LoginFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
        reset,
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const snackbar = useSnackbar();
    const mutation = useMutation(
        async (formData: FormSchema) => loginUser(formData),
        {
            async onSuccess() {
                await router.push('/');
            },
            onError(error: CustomError) {
                if (error.errorMessage)
                    snackbar.show(error.errorMessage, 'error');
            },
        }
    );
    const onSubmit = handleSubmit((formData) => mutation.mutate(formData));

    useEffect(() => {
        if (showDialog) setFocus('email');
    }, [setFocus, showDialog]);

    return (
        <div className='space-y-5'>
            <div className={clsx('flex items-center')}>
                <h2 className={clsx('font-bold text-lg flex-1 text-center')}>
                    Login to your account
                </h2>
                <button
                    className='btn btn-circle btn-sm btn-outline'
                    type='button'
                    onClick={() => {
                        setShowDialog(false);
                        reset();
                    }}
                >
                    <AiOutlineClose fontSize={18} />
                </button>
            </div>
            <form method='post' onSubmit={onSubmit}>
                <FormLabel
                    errorText={errors.email?.message}
                    id='email'
                    labelText='What is your email'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.email }
                        )}
                        id='email'
                        placeholder='Your email...'
                        type='email'
                        {...register('email')}
                    />
                </FormLabel>
                <FormLabel
                    errorText={errors.password?.message}
                    id='password'
                    labelText='What is your password?'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.password }
                        )}
                        id='password'
                        placeholder='Your password...'
                        type='password'
                        {...register('password')}
                    />
                </FormLabel>
                <button
                    className={clsx('btn btn-primary btn-block mt-5', {
                        loading: mutation.isLoading,
                    })}
                    type='submit'
                >
                    Login
                </button>
            </form>
        </div>
    );
}
