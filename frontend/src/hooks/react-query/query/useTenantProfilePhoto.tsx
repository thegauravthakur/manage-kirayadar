import { useRouter } from 'next/router';
import { useSession } from '../../useSession';
import { useQuery } from 'react-query';
import { fetchTenantProfilePhoto } from '../../../helpers/tenantHelper';

export function useTenantProfilePhoto() {
    const { tenantId } = useRouter().query as Record<string, string>;
    const { token } = useSession();
    const { data: profilePhoto, isLoading } = useQuery(
        ['photo', tenantId],
        async () => fetchTenantProfilePhoto(token!, tenantId),
        { enabled: !!token, refetchOnWindowFocus: false }
    );
    return { profilePhoto, isLoading };
}
