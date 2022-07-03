import { useQuery } from 'react-query';
import { getCurrentUser } from '../helpers/userHelper';
import { useAccessToken } from './useAccessToken';
import { User } from '../types';

export interface Session {
    session: { user?: User; token: string };
    isLoading: boolean;
}

export function useSession(): Session {
    const [token] = useAccessToken();
    const { data: session, isLoading } = useQuery(
        'session',
        async () => {
            const result = await getCurrentUser(token ?? '');
            return result.data;
        },
        { enabled: token !== undefined }
    );
    return { session: { ...session, token: token! }, isLoading };
}
