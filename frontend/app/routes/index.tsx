import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import type { User } from '~/models/user.server';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { getCurrentUser } from '~/models/user.server';

export default function Index() {
    const { user } = useLoaderData() as { user: User };
    return (
        <div className='flex h-screen items-center justify-center flex-col'>
            <h1 className='font-bold'>Welcome, {user.name}</h1>
            <Form action='/logout' method='post'>
                <button className='' type='submit'>
                    Logout
                </button>
            </Form>
        </div>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const user = await getCurrentUser(request);
        if (!user) return redirect('/login');
        return json({ user });
    } catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) message = error.message;
        return json(message, { status: 500 });
    }
};
