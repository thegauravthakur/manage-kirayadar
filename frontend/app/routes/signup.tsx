import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { createEndpoint } from '../../utils/fetchHelper';
import { getCurrentUser } from '~/models/user.server';

export interface User {
    id: number;
    email: string;
    name: string;
    avatarUrl: null;
}

interface ActionData {
    errors?: string[];
}

export default function Signup() {
    const transition = useTransition();
    return (
        <div className='h-screen flex justify-center items-center bg-slate-100'>
            <Form
                className='border space-y-6 py-6 px-4 rounded-md w-full max-w-sm shadow bg-white'
                method='post'
            >
                <h1 className='text-2xl font-bold text-center text-blue-600'>
                    Create your account
                </h1>
                <fieldset
                    className='space-y-4'
                    disabled={transition.state !== 'idle'}
                >
                    <div className='space-y-1.5'>
                        <label htmlFor='name'>
                            <h2>Name</h2>
                        </label>
                        <input
                            required
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='name'
                            name='name'
                            type='text'
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='email'>
                            <h2>Email</h2>
                        </label>
                        <input
                            required
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100'
                            id='email'
                            name='email'
                            type='email'
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
                            name='password'
                            type='password'
                        />
                    </div>
                    <button
                        className='w-full p-1.5 border rounded-md bg-blue-600 text-white outline-none focus:ring'
                        type='submit'
                    >
                        submit
                    </button>
                </fieldset>
            </Form>
        </div>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getCurrentUser(request);
    if (user) return redirect('/');
    return json(null);
};

export const action: ActionFunction = async ({ request }) => {
    try {
        await new Promise((res) => setTimeout(res, 5000));
        const formData = await request.formData();
        const userData = Object.fromEntries(formData);
        const response = await fetch(createEndpoint('user/create'), {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'content-type': 'application/json',
            },
        });
        if (!response.ok) {
            return json<ActionData>(
                { errors: await response.json() },
                { status: response.status }
            );
        }
        return redirect('/login');
    } catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) message = error.message;
        return json<ActionData>({ errors: [message] }, { status: 500 });
    }
};