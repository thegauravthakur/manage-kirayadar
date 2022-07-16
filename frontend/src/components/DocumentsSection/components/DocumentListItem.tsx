import clsx from 'clsx';
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';

interface DocumentListItemProps {
    name: string;
    isLast?: boolean;
}
export function DocumentListItem({
    name,
    isLast = false,
}: DocumentListItemProps) {
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
                <button className='btn btn-circle btn-sm btn-ghost'>
                    <AiOutlineEdit size={25} />
                </button>
            </div>
        </li>
    );
}
