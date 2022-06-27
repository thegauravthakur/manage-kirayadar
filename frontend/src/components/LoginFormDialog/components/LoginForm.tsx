import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { JSONResponse, postWithData } from '../../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomError } from '../../../types';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';

const formSchema = z.object({
    email: z.string().email({ message: 'email' }),
    password: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

async function loginUser(formData: FormSchema) {
    const response = await postWithData('api/auth/login', formData);
    const result: JSONResponse = await response.json();
    if (!response.ok) throw result;
    return result;
}

const inputClasses = (condition: boolean) =>
    clsx(
        'outline-offset-0 outline-1 border rounded-md w-full outline-none focus:outline-blue-600 p-1.5 bg-slate-100 text-sm',
        { 'outline outline-rose-300 focus:outline-rose-300': condition }
    );

export function LoginForm() {
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
                if (error.errorMessage) snackbar.show(error.errorMessage);
            },
        }
    );
    const onSubmit = handleSubmit((formData) => mutation.mutate(formData));

    useEffect(() => {
        setFocus('email');
    }, [setFocus]);

    return (
        <form
            className='space-y-6 p-4 rounded-md w-full max-w-sm mx-auto'
            method='post'
            onSubmit={onSubmit}
        >
            <fieldset className='space-y-4 text-sm'>
                <div className='space-y-1.5'>
                    <label htmlFor='email'>
                        <h2>Email</h2>
                    </label>
                    <input
                        className={inputClasses(!!errors.email)}
                        id='email'
                        type='email'
                        {...register('email')}
                    />
                    <p className='text-rose-600 text-sm'>
                        {errors.email && errors.email.message}
                    </p>
                </div>
                <div className='space-y-1.5'>
                    <label htmlFor='password'>
                        <h2>Password</h2>
                    </label>
                    <input
                        required
                        className={inputClasses(!!errors.password)}
                        id='password'
                        type='password'
                        {...register('password')}
                    />
                    <p className='text-rose-600 text-sm'>
                        {errors.password && errors.password.message}
                    </p>
                </div>
                <button
                    className='w-full p-1.5 border rounded-md bg-blue-600 text-white'
                    type='submit'
                >
                    Login
                </button>
            </fieldset>
        </form>
    );
}
