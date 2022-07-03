import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { JSONResponse, postWithData } from '../../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { RefObject, useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomError } from '../../../types';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';

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
    formRef: RefObject<HTMLFormElement>;
}

export function LoginForm({ formRef, showDialog }: LoginFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
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
        <form
            ref={formRef}
            className='p-4 rounded-md w-full max-w-sm mx-auto'
            method='post'
            onSubmit={onSubmit}
        >
            <fieldset>
                <label className='label' htmlFor='email'>
                    <span className='label-text'>What is your email?</span>
                </label>
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
                <label className='label'>
                    {errors.email && (
                        <span className='label-text-alt text-error'>
                            {errors.email.message}
                        </span>
                    )}
                </label>
                <label className='label' htmlFor='password'>
                    <span className='label-text'>What is your password?</span>
                </label>
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
                <label className='label'>
                    {errors.password && (
                        <span className='label-text-alt text-error'>
                            {errors.password.message}
                        </span>
                    )}
                </label>
                <button
                    className={clsx('btn btn-primary btn-block', {
                        loading: mutation.isLoading,
                    })}
                    type='submit'
                >
                    Login
                </button>
            </fieldset>
        </form>
    );
}
