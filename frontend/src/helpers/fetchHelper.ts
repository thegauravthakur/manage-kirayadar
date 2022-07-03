export function createEndpoint(endpoint: string) {
    return `http://localhost:4242/${endpoint}`;
}

export async function fetchWithToken(endpoint: string, token: string) {
    return await fetch(endpoint, {
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
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

export async function postWithToken(
    endpoint: string,
    token: string,
    data: unknown
) {
    return await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}
