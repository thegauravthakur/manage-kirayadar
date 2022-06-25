import type { ActionFunction } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';

export default function Login() {
    const transition = useTransition();
    if (transition.state === 'submitting') return <p>submitting...</p>;
    if (transition.state === 'loading') return <p>loading...</p>;

    return (
        <div>
            <h1 className='text-4xl font-bold text-rose-800'>Login Page</h1>
            <Form method='post'>
                <label htmlFor='email'>Email:</label>
                <input id='email' name='email' type='email' />
                <label htmlFor='password'>Password:</label>
                <input id='password' type='password' />
                <button type='submit'>submit</button>
            </Form>
        </div>
    );
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    console.log(formData.get('email'));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return 'yo';
};
