import { useSession } from './useSession';
import { useQuery } from 'react-query';
import { createEndpoint, fetchWithToken } from '../helpers/fetchHelper';
import { Property } from '../types';

export function useProperties() {
    const { session } = useSession();
    const { data: properties, isLoading } = useQuery<Property[]>(
        'properties',
        async () => {
            const response = await fetchWithToken(
                createEndpoint('property/get'),
                session.token
            );
            const result = await response.json();
            if (response.ok) return result.data.properties;
            return result.data;
        },
        { enabled: !!session.token }
    );
    return { properties, isLoading };
}
