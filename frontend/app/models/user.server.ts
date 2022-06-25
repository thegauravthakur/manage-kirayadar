import type { DataFunctionArgs } from '@remix-run/node';
import { accessToken } from '~/cookies';
import { createEndpoint, fetchWithToken } from '../../utils/fetchHelper';

export interface User {
    id: number;
    email: string;
    avatarUrl?: string;
    name: string;
}

export function test() {
    return createEndpoint('user/current');
}
export async function getCurrentUser(request: DataFunctionArgs['request']) {
    const cookieHeader = request.headers.get('Cookie');
    const access_token = (await accessToken.parse(cookieHeader)) || {};
    const { user } = await fetchWithToken(
        createEndpoint('user/current'),
        access_token
    );
    if (!user) return;
    const { iat, exp, ...filteredUser } = user;
    return filteredUser as User;
}
