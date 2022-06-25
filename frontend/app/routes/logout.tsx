import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { accessToken } from '~/cookies';

export const action: ActionFunction = async () => {
    return redirect('/login', {
        headers: {
            'Set-Cookie': await accessToken.serialize('', {
                maxAge: -1,
            }),
        },
    });
};

export const loader: LoaderFunction = async () => {
    return redirect('/login');
};
