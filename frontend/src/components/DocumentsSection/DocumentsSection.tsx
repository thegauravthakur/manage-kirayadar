import { DocumentListItem } from './components/DocumentListItem';
import { useRouter } from 'next/router';
import { useDocuments } from '../../hooks/react-query/useDocuments';
import { LoadingWrapper } from '../LoadingWrapper';

const staticDocuments = [
    'Adhaar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Salary Slip',
];
export function DocumentsSection() {
    const { tenantId } = useRouter().query;
    const { documents, isLoading } = useDocuments(Number(tenantId));
    const additionalDocs = staticDocuments.filter((doc) => {
        return !(documents ?? []).some((document) => document.name === doc);
    });
    return (
        <div className='bg-base-100 p-5 space-y-2 rounded-xl shadow-md w-full max-w-md relative'>
            {isLoading && <LoadingWrapper />}
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
