import clsx from 'clsx';
import {
    AiOutlineDownload,
    AiOutlineEdit,
    AiOutlineDelete,
} from 'react-icons/ai';
import { useSession } from '../../../hooks/useSession';
import {
    createEndpoint,
    postWithToken,
    uploadFile,
} from '../../../helpers/fetchHelper';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { CustomError } from '../../../types';
import { useRouter } from 'next/router';
import { LoadingWrapper } from '../../LoadingWrapper';
import { useGlobalSpinner } from '../../../hooks/zustand/useGlobalSpinner';

export async function showFilePicker() {
    try {
        return await (window as any).showOpenFilePicker({
            multiple: false,
            types: [{ accept: { 'image/*': [] } }],
        });
    } catch (error) {
        return null;
    }
}

function downloadFile(blob: Blob, fileName: string) {
    const imageObjectURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = imageObjectURL;
    const [, extension] = blob.type.split('/');
    link.setAttribute('download', `${fileName}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
}

async function fetchMutation(
    tenantId: number,
    documentId: number,
    token: string
) {
    const response = await postWithToken(
        createEndpoint('documents/fetchFile'),
        token,
        { tenantId, documentId }
    );
    return response.blob();
}

interface DocumentListItemProps {
    name: string;
    isLast?: boolean;
    showDownloadButton?: boolean;
    documentId?: number | null;
}
export function DocumentListItem({
    name,
    isLast = false,
    showDownloadButton = true,
    documentId = null,
}: DocumentListItemProps) {
    const { show: showSpinner, hide: hideSpinner } = useGlobalSpinner();
    const { session } = useSession();
    const queryClient = useQueryClient();
    const { show } = useSnackbar();
    const queryParams = useRouter().query;

    const mutation = useMutation(
        async (handles: unknown) =>
            uploadFile(session.token, handles, name, queryParams),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries([
                    'documents',
                    Number(queryParams.tenantId),
                ]);
                show('file uploaded successfully!', 'success');
            },
            onError: (data: CustomError) => show(data?.errorMessage, 'error'),
        }
    );

    const deleteMutation = useMutation(
        async () => {
            if (documentId)
                await postWithToken(
                    createEndpoint('documents/deleteFile'),
                    session.token,
                    { documentId, tenantId: Number(queryParams.tenantId) }
                );
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries([
                    'documents',
                    Number(queryParams.tenantId),
                ]);
                show('file uploaded successfully!', 'success');
            },
            onError: (data: CustomError) => show(data?.errorMessage, 'error'),
        }
    );

    return (
        <>
            <li
                className={clsx(
                    { 'border-b': !isLast },
                    'flex items-center justify-between py-2'
                )}
            >
                <p>{name}</p>
                <div className='space-x-2'>
                    {showDownloadButton && (
                        <button
                            className='btn btn-circle btn-sm btn-ghost'
                            onClick={async () => {
                                showSpinner();
                                if (documentId) {
                                    const blob = await fetchMutation(
                                        Number(queryParams.tenantId),
                                        documentId,
                                        session.token
                                    );
                                    downloadFile(blob, name);
                                }
                                hideSpinner();
                            }}
                        >
                            <AiOutlineDownload size={25} />
                        </button>
                    )}
                    <button
                        className='btn btn-circle btn-sm btn-ghost'
                        onClick={async () => {
                            const handles = await showFilePicker();
                            if (handles) await mutation.mutate(handles);
                        }}
                    >
                        <AiOutlineEdit size={25} />
                    </button>
                    {showDownloadButton && (
                        <button
                            className='btn btn-circle btn-sm btn-ghost'
                            onClick={() => {
                                deleteMutation.mutate();
                            }}
                        >
                            <AiOutlineDelete size={25} />
                        </button>
                    )}
                </div>
            </li>
            {(mutation.isLoading || deleteMutation.isLoading) && (
                <LoadingWrapper />
            )}
        </>
    );
}
