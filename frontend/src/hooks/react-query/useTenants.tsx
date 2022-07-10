import { useQuery } from 'react-query';
import { Tenant } from '../../types';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { useSession } from '../useSession';

export function useTenants(spaceId: number, initialData?: Tenant[]) {
    const { session } = useSession();
    const { data: tenants, isLoading } = useQuery<Tenant[]>(
        ['tenants', spaceId],
        async () => {
            await new Promise((res) => setTimeout(res, 5000));
            const response = await postWithToken(
                createEndpoint('tenant/get'),
                session.token,
                { spaceId }
            );
            const result = await response.json();
            if (response.ok) return result.data.tenants;
            return result.data;
        },
        { enabled: !!session.token, initialData }
    );
    return { tenants, isLoading };
}
