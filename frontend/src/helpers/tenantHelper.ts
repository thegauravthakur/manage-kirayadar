import { createEndpoint, postWithToken } from './fetchHelper';

export async function updateTenantProfilePhoto(
    token: string,
    file: File,
    tenantId: string
) {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    formData.append('tenantId', tenantId);
    const response = await fetch(createEndpoint('tenant/updateProfile'), {
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

export async function fetchTenantProfilePhoto(token: string, tenantId: string) {
    const response = await postWithToken(
        createEndpoint('tenant/profilePhoto'),
        token,
        { tenantId }
    );
    const { data } = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
}
