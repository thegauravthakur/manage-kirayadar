import { fromEvent } from 'file-selector';

function getHost() {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';
    if (env === 'production') return 'https://manage-kirayadar.herokuapp.com/';
    return 'http://localhost:4242/';
}
export function createEndpoint(endpoint: string) {
    const host = getHost();
    return `${host}${endpoint}`;
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

export async function uploadFile(
    token: string,
    handles: unknown,
    fileName: string,
    { propertyId, spaceId, tenantId }: any
) {
    const [file] = (await fromEvent(handles)) as [File];
    const formData = new FormData();
    formData.append('document', file as File);
    formData.append('name', fileName);
    formData.append('propertyId', propertyId);
    formData.append('spaceId', spaceId);
    formData.append('tenantId', tenantId);
    const response = await fetch(createEndpoint('documents/uploadFile'), {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}
