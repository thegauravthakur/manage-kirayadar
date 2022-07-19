import clsx from 'clsx';
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';
import { useSession } from '../../../hooks/useSession';
import {
    createEndpoint,
    postWithToken,
    uploadFile,
} from '../../../helpers/fetchHelper';
import { useMutation } from 'react-query';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { CustomError } from '../../../types';
import { useRouter } from 'next/router';

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

async function fetchMutation(tenantId: number, documentId: number) {
    const response = await postWithToken(
        createEndpoint('documents/fetchFile'),
        '',
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
    const { session } = useSession();
    const { show } = useSnackbar();
    const queryParams = useRouter().query;

    const mutation = useMutation(
        async (handles: unknown) =>
            uploadFile(session.token, handles, name, queryParams),
        {
            onSuccess: () => show('file uploaded successfully!', 'success'),
            onError: (data: CustomError) => show(data?.errorMessage, 'error'),
        }
    );

    return (
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
                            if (documentId) {
                                const blob = await fetchMutation(
                                    Number(queryParams.tenantId),
                                    documentId
                                );
                                downloadFile(blob, name);
                            }
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
            </div>
        </li>
    );
}
