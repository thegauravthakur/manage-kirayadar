import { useSnackbar } from '../../../hooks/zustand/useSnackbar';
import { useEffect } from 'react';
import clsx from 'clsx';
import { AiOutlineClose } from 'react-icons/ai';

interface SnackbarItemProps {
    value: string;
    index: number;
}

export function SnackbarItem({ value, index }: SnackbarItemProps) {
    const { hide, hideLast } = useSnackbar();

    useEffect(() => {
        const timeout = setTimeout(() => {
            hideLast();
        }, 3000);
        return () => clearTimeout(timeout);
    }, [hideLast]);

    return (
        <div
            className={clsx(
                'border px-4 py-1.5 rounded-md w-max',
                'text-xs text-white bg-gray-600',
                'flex items-center space-x-3'
            )}
        >
            <p className=''>{value}</p>
            <button onClick={() => hide(index)}>
                <AiOutlineClose fontSize={14} />
            </button>
        </div>
    );
}
