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
