import { global } from 'styled-jsx/css';

export function createEndpoint(endpoint: string) {
    return `http://localhost:4242/${endpoint}`;
}

export async function fetchWithToken(endpoint: string, token: string) {
    const response = await fetch(endpoint, {
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export interface JSONResponse<T = null> {
    data: null | T;
    error: null | string;
}

export async function postWithData(endpoint: string, data: unknown) {
    return await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    });
}
