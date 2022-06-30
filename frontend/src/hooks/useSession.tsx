import { useQuery } from 'react-query';
import { getCurrentUser } from '../helpers/userHelper';
import { useAccessToken } from './useAccessToken';

export function useSession() {
    const [token] = useAccessToken();
    const { data: session, isLoading } = useQuery(
        'session',
        async () => {
            const result = await getCurrentUser(token ?? '');
            return result.data;
        },
        { enabled: token !== undefined }
    );
    return { session, isLoading };
}
