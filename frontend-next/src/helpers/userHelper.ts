import {
    createEndpoint,
    fetchWithToken,
    JSONResponse,
    postWithData,
} from './fetchHelper';
import { useRouter } from 'next/router';

export interface User {
    id: number;
    email: string;
    avatarUrl: string | null;
    name: string;
}

export async function createNewUser(formData: unknown) {
    const response = await postWithData(
        createEndpoint('user/create'),
        formData
    );
    const result = await response.json();
    if (!response.ok) throw result;
}

export async function logoutUser() {
    const response = await fetch('/api/auth/logout');
    if (!response.ok) throw new Error('failed to logout!');
}

export async function getCurrentUser(accessToken: string) {
    const response = await fetchWithToken(
        createEndpoint('user/current'),
        accessToken
    );
    if (!response.ok) throw new Error('unauthorized!');
    const result: JSONResponse<{ user: User }> = await response.json();
    return result;
}
