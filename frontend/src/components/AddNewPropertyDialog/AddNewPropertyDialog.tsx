import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

interface AddNewPropertyDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export function AddNewPropertyDialog({
    showDialog,
    setShowDialog,
}: AddNewPropertyDialogProps) {
    return (
        <div className={clsx('modal', { 'modal-open': showDialog })}>
            <div className='modal-box'>
                <p>yay</p>
            </div>
        </div>
    );
}
