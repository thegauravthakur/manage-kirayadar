import { useQuery } from 'react-query';

export function useAccessToken(): [string | null | undefined, boolean] {
    const { data: accessToken, isLoading } = useQuery(
        'accessToken',
        async () => {
            const response = await fetch('/api/auth/accessToken');
            const { data } = await response.json();
            if (data) return data.token as string;
            return null;
        }
    );
    return [accessToken, isLoading];
}
