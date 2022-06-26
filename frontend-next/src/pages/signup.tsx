import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { createEndpoint, postWithData } from '../helpers/fetchHelper';
import { useRouter } from 'next/router';

export interface User {
    id: number;
    email: string;
    name: string;
    avatarUrl: null;
}

interface FormData {
    name: string;
    email: string;
    password: string;
}

export default function Signup() {
    const { register, handleSubmit } = useForm<FormData>();
    const router = useRouter();
    const mutation = useMutation(
        async (formData: FormData) => {
            const response = await postWithData(
                createEndpoint('user/create'),
                formData
            );
            const result = await response.json();
            if (!response.ok) throw result;
        },
        { onSuccess: () => router.push('/login') }
    );
    const onSubmit = handleSubmit((data) => mutation.mutate(data));
    return (
        <div className='h-screen flex justify-center items-center bg-slate-100'>
            <form
                className='border space-y-6 py-6 px-4 rounded-md w-full max-w-sm shadow bg-white'
                onSubmit={onSubmit}
            >
                <h1 className='text-2xl font-bold text-center text-blue-600'>
                    Create your account
                </h1>
                <fieldset className='space-y-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='name'>
                            <h2>Name</h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='name'
                            type='text'
                            {...register('name', { required: true })}
                        />
                    </div>
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
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='password'
                            type='password'
                            {...register('password', { required: true })}
                        />
                    </div>
                    <button
                        className='w-full p-1.5 border rounded-md bg-blue-600 text-white outline-none focus:ring'
                        type='submit'
                    >
                        submit
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
