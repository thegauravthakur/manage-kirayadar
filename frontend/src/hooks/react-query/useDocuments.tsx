import { useSession } from '../useSession';
import { useQuery } from 'react-query';
import { Document } from '../../types';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';

export function useDocuments(tenantId: number) {
    const { session } = useSession();
    const { data: documents, isLoading } = useQuery<Document[]>(
        ['documents', tenantId],
        async () => {
            const response = await postWithToken(
                createEndpoint('documents/allDocuments'),
                session.token,
                { tenantId }
            );
            const { data } = await response.json();
            if (!response.ok) throw data;
            return data.documents;
        },
        { enabled: !!session.token }
    );
    return { documents, isLoading };
}
