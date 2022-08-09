import { Space } from '../../../types';
import { useSession } from '../../useSession';
import { useQuery } from 'react-query';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';

export function useSpace(
    propertyId: number,
    spaceId: number,
    initialData?: Space
) {
    const { token } = useSession();
    const { data: space, isLoading } = useQuery<Space>(
        [propertyId, 'spaces', spaceId],
        async () => {
            const response = await postWithToken(
                createEndpoint(`space/get?spaceId=${spaceId}`),
                token!,
                { propertyId }
            );
            const result = await response.json();
            if (response.ok) return result.data.space;
            return result.data;
        },
        { enabled: !!token, initialData }
    );
    return { space, isLoading };
}
