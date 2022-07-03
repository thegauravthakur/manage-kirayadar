import { SnackBarState, useSnackbar } from '../../hooks/zustand/useSnackbar';
import {
    HiOutlineCheckCircle,
    HiExclamationCircle,
    HiInformationCircle,
} from 'react-icons/hi';
import { useEffect } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineClose } from 'react-icons/ai';
import clsx from 'clsx';

const typeIconMapping: Record<SnackBarState['type'], IconType> = {
    success: HiOutlineCheckCircle,
    error: HiExclamationCircle,
    info: HiInformationCircle,
};
const typeClassMapping: Record<SnackBarState['type'], string> = {
    success: 'alert-success',
    info: 'alert-info',
    error: 'alert-error',
};

export function Snackbar() {
    const { type, hide, message } = useSnackbar();
    const Icon = typeIconMapping[type];
    const alertClass = typeClassMapping[type];

    useEffect(() => {
        const timeout = setTimeout(() => {
            hide();
        }, 5000);
        return () => {
            clearTimeout(timeout);
        };
    }, [hide, message]);

    if (!message) return null;

    return (
        <div
            className={clsx(
                'alert absolute z-[9999] w-auto left-0 right-0 m-5 max-w-4xl mx-auto',
                alertClass
            )}
        >
            <div>
                <Icon fontSize={28} />
                <span>{message}</span>
            </div>
            <div className='flex-none'>
                <button
                    className='btn btn-circle btn-sm btn-outline'
                    type='button'
                    onClick={hide}
                >
                    <AiOutlineClose fontSize={18} />
                </button>
            </div>
        </div>
    );
}
