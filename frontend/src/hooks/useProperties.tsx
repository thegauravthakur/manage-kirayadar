import { useQuery } from 'react-query';
import { createEndpoint, requestWithToken } from '../helpers/fetchHelper';
import { CustomError, Property } from '../types';
import { useSnackbar } from './zustand/useSnackbar';

const errorMessage = 'Error occurred while getting all the properties';

async function getProperties(): Promise<Property[]> {
    const response = await requestWithToken(createEndpoint('property', true), {
        method: 'GET',
    });
    const { data } = (await response.json()) as {
        data: { properties: Property[] };
    };
    if (response.ok) return data.properties;
    else throw data;
}

export function useProperties() {
    const { show } = useSnackbar();
    const { data: properties, isLoading } = useQuery<Property[]>(
        'properties',
        async () => getProperties(),
        {
            onError: (error) => {
                const message =
                    (error as CustomError)?.errorMessage ?? errorMessage;
                show(message, 'error');
            },
        }
    );
    return { properties, isLoading };
}
