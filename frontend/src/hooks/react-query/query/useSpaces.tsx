import { useQuery } from 'react-query';
import { Space } from '../../../types';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { useSession } from '../../useSession';

export function useSpaces(propertyId: number, initialData?: Space[]) {
    const { token } = useSession();
    const { data: spaces, isLoading } = useQuery<Space[]>(
        ['spaces', propertyId],
        async () => {
            await new Promise((res) => setTimeout(res, 5000));
            const response = await postWithToken(
                createEndpoint('space/get'),
                token!,
                { propertyId }
            );
            const result = await response.json();
            if (response.ok) return result.data.spaces;
            return result.data;
        },
        { enabled: !!session.token, initialData }
    );
    return { spaces, isLoading };
}
