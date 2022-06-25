import type { ActionFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { Maybe } from '../../utils/types';
import { createEndpoint } from '../../utils/fetchHelper';

interface User {
    id: number;
    email: string;
    name: string;
    avatarUrl: null;
}

interface ActionData {
    errors?: string[];
    user?: User;
}

export default function Login() {
    const actionData = useActionData() as Maybe<ActionData>;
    console.log(actionData);
    return (
        <div className='h-screen flex justify-center items-center'>
            <Form
                className='border space-y-6 p-4 rounded-md w-full max-w-sm shadow'
                method='post'
            >
                <h1 className='text-2xl font-bold text-center text-blue-600'>
                    Login Page
                </h1>
                <fieldset className='space-y-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='name'>
                            <h2>Name</h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5'
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
                            className='border rounded-md w-full p-1.5'
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
                            className='border rounded-md w-full p-1.5'
                            id='password'
                            name='password'
                            type='password'
                        />
                    </div>
                    <button
                        className='w-full p-1.5 border rounded-md bg-blue-600 text-white'
                        type='submit'
                    >
                        submit
                    </button>
                </fieldset>
            </Form>
        </div>
    );
}

export const action: ActionFunction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const object = Object.fromEntries(formData);
        const response = await fetch(createEndpoint('user/create'), {
            method: 'POST',
            body: JSON.stringify(object),
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
        return json<ActionData>(await response.json());
    } catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) message = error.message;
        return json<ActionData>({ errors: [message] }, { status: 500 });
    }
};
