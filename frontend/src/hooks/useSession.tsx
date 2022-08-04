import { useQuery } from 'react-query';
import { getCurrentUser } from '../helpers/userHelper';
import { useAccessToken } from './useAccessToken';
import { User } from '../types';

export interface Session {
    user?: User | null;
    token?: string | null;
    isLoading: boolean;
}

export function useSession(): Session {
    const [token] = useAccessToken();
    const { data: user, isLoading } = useQuery(
        'session',
        async () => {
            const user = await getCurrentUser(token ?? '');
            return user;
        },
        { enabled: token !== undefined }
    );
    return { user, token: token, isLoading };
}
