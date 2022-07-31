import { useSession } from './useSession';
import { useQuery } from 'react-query';
import { createEndpoint, fetchWithToken } from '../helpers/fetchHelper';
import { CustomError, Property } from '../types';
import { useSnackbar } from './zustand/useSnackbar';

const errorMessage = 'Error occurred while getting all the properties';

async function getProperties(token: string): Promise<Property[]> {
    const response = await fetchWithToken(
        createEndpoint('property/get'),
        token
    );
    const { data } = (await response.json()) as {
        data: { properties: Property[] };
    };
    console.log(data);
    if (response.ok) return data.properties;
    else throw data;
}

export function useProperties() {
    const { session } = useSession();
    const { show } = useSnackbar();
    const { data: properties, isLoading } = useQuery<Property[]>(
        'properties',
        async () => getProperties(session.token),
        {
            enabled: !!session.token,
            onError: (error) => {
                const message =
                    (error as CustomError)?.errorMessage ?? errorMessage;
                show(message, 'error');
            },
        }
    );
    return { properties, isLoading };
}
