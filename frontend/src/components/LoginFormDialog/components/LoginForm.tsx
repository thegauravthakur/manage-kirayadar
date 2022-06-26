import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { JSONResponse, postWithData } from '../../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface FormData {
    email: string;
    password: string;
}

export function LoginForm() {
    const router = useRouter();
    const { register, handleSubmit, setFocus } = useForm<FormData>();
    const mutation = useMutation(
        async (formData: FormData) => {
            const response = await postWithData('api/auth/login', formData);
            const result: JSONResponse = await response.json();
            if (!response.ok) throw result;
            return result;
        },
        { onSuccess: () => router.push('/') }
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
            <fieldset className='space-y-4'>
                <div className='space-y-1.5'>
                    <label htmlFor='email'>
                        <h2>Email</h2>
                    </label>
                    <input
                        className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                        id='email'
                        type='email'
                        {...register('email', { required: true })}
                    />
                </div>
                <div className='space-y-1.5'>
                    <label htmlFor='password'>
                        <h2>Password</h2>
                    </label>
                    <input
                        required
                        className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                        id='password'
                        type='password'
                        {...register('password', { required: true })}
                    />
                </div>
                <button
                    className='w-full p-1.5 border rounded-md bg-blue-600 text-white'
                    type='submit'
                >
                    submit
                </button>
            </fieldset>
        </form>
    );
}
