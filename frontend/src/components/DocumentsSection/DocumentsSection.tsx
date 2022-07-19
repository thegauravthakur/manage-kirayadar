import { DocumentListItem } from './components/DocumentListItem';
import { useSession } from '../../hooks/useSession';
import { useQuery } from 'react-query';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import type { Document } from '../../types';

function useDocuments(tenantId: number) {
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
const staticDocuments = [
    'Adhaar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Salary Slip',
];
export function DocumentsSection() {
    const { tenantId } = useRouter().query;
    const { documents } = useDocuments(Number(tenantId));
    const additionalDocs = staticDocuments.filter((doc) => {
        return !(documents ?? []).some((document) => document.name === doc);
    });
    return (
        <div className='bg-base-100 p-5 space-y-2 rounded-xl shadow-md w-full max-w-md'>
            <h2 className='text-xl text-primary font-semibold'>Documents</h2>
            <ul>
                {documents?.map(({ name, id }) => (
                    <DocumentListItem key={id} documentId={id} name={name} />
                ))}
                {additionalDocs.map((document) => (
                    <DocumentListItem
                        key={document}
                        name={document}
                        showDownloadButton={false}
                    />
                ))}
            </ul>
        </div>
    );
}
