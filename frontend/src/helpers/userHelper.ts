import {
    createEndpoint,
    fetchWithToken,
    JSONResponse,
    postWithData,
    requestWithToken,
} from './fetchHelper';
import type { User } from '../types';

export async function createNewUser(formData: unknown) {
    const response = await postWithData(
        createEndpoint('user/create'),
        formData
    );
    const result = await response.json();
    if (!response.ok) throw result;
}

export async function logoutUser() {
    const response = await requestWithToken(
        createEndpoint('auth/logout', true),
        { method: 'GET' }
    );
    if (!response.ok) throw new Error('failed to logout!');
}

export async function getCurrentUser(accessToken?: string) {
    const response = await fetchWithToken(
        createEndpoint('auth/validate', true),
        accessToken
    );
    if (!response.ok) return null;
    const { data }: JSONResponse<{ user: User }> = await response.json();
    return data?.user;
}
