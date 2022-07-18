import clsx from 'clsx';
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';
import { useSession } from '../../../hooks/useSession';
import {
    createEndpoint,
    fetchWithToken,
    postWithToken,
    uploadFile,
} from '../../../helpers/fetchHelper';
import { useMutation, useQuery } from 'react-query';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { CustomError } from '../../../types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
async function showFilePicker() {
    try {
        return await (window as any).showOpenFilePicker({
            multiple: false,
            types: [{ accept: { 'image/*': [] } }],
        });
    } catch (error) {
        return null;
    }
}
function useDocuments(tenantId: number) {
    const { session } = useSession();
    const { data: documents, isLoading } = useQuery(
        ['documents', tenantId],
        async () => {
            const response = await postWithToken(
                createEndpoint('documents/allDocuments'),
                session.token,
                { tenantId }
            );
            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        },
        { enabled: !!session.token }
    );
    return { documents, isLoading };
}

interface DocumentListItemProps {
    name: string;
    isLast?: boolean;
}
export function DocumentListItem({
    name,
    isLast = false,
}: DocumentListItemProps) {
    const { session } = useSession();
    const { show } = useSnackbar();
    const queryParams = useRouter().query;
    const { documents } = useDocuments(Number(queryParams.tenantId));
    console.log({ documents });
    const mutation = useMutation(
        async (handles: unknown) =>
            uploadFile(session.token, handles, name, queryParams),
        {
            onSuccess: () => show('file uploaded successfully!', 'success'),
            onError: (data: CustomError) => show(data?.errorMessage, 'error'),
        }
    );
    // useEffect(() => {
    //     fetch(createEndpoint('documents/allDocuments')).then(async (d) => {
    //         const data = await d.json();
    //         console.log(data);
    //     });
    // }, []);
    return (
        <li
            className={clsx(
                { 'border-b': !isLast },
                'flex items-center justify-between py-2'
            )}
        >
            <p>{name}</p>
            <div className='space-x-2'>
                <button className='btn btn-circle btn-sm btn-ghost'>
                    <AiOutlineDownload size={25} />
                </button>
                <button
                    className='btn btn-circle btn-sm btn-ghost'
                    onClick={async () => {
                        const handles = await showFilePicker();
                        if (handles) await mutation.mutate(handles);
                    }}
                >
                    <AiOutlineEdit size={25} />
                </button>
            </div>
        </li>
    );
}
