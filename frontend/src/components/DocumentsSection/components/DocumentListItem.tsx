import clsx from 'clsx';
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';
import { useSession } from '../../../hooks/useSession';
import { uploadFile } from '../../../helpers/fetchHelper';
import { useMutation } from 'react-query';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { CustomError } from '../../../types';
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
    const mutation = useMutation(
        async (handles: unknown) => uploadFile(handles, 'adhaar'),
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
