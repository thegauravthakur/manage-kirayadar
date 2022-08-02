import { SnackBarState, useSnackbar } from '../../hooks/zustand/useSnackbar';
import {
    HiOutlineCheckCircle,
    HiExclamationCircle,
    HiInformationCircle,
} from 'react-icons/hi';
import { useEffect } from 'react';
import { IconType } from 'react-icons';
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
                'flex absolute z-[9999] w-[97%] left-0 right-0 m-5 max-w-4xl mx-auto rounded-xl items-center',
                'p-2 space-x-2 sm:px-4 sm:space-x-4 md:px-5 md:py-3 md:space-x-5',
                alertClass
            )}
        >
            <Icon className='flex-shrink-0' fontSize={28} />
            <span>{message}</span>
        </div>
    );
}
