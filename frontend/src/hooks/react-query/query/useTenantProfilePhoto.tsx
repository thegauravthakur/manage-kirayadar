import { useRouter } from 'next/router';
import { useSession } from '../../useSession';
import { useQuery } from 'react-query';
import { fetchTenantProfilePhoto } from '../../../helpers/tenantHelper';

export function useTenantProfilePhoto() {
    const { tenantId } = useRouter().query as Record<string, string>;
    const { session } = useSession();
    const { data: profilePhoto, isLoading } = useQuery(
        ['photo', tenantId],
        async () => fetchTenantProfilePhoto(session.token, tenantId),
        { enabled: !!session.token, refetchOnWindowFocus: false }
    );
    return { profilePhoto, isLoading };
}
