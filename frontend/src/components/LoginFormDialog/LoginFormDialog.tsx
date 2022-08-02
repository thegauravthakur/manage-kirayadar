import { AiOutlineClose } from 'react-icons/ai';
import { Dispatch, SetStateAction, useRef } from 'react';
import ReactFocusLock from 'focus-trap-react';
import clsx from 'clsx';
import { LoginForm } from './components/LoginForm';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';

interface SignUpDialogProps {
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    showDialog: boolean;
}
export function LoginFormDialog({
    setShowDialog,
    showDialog,
}: SignUpDialogProps) {
    if (!showDialog) return null;
    return (
        <ClientOnlyPortal>
            <ReactFocusLock active={showDialog}>
                <div
                    className={clsx('modal', {
                        'modal-open': showDialog,
                    })}
                    onKeyDown={({ key }) => {
                        if (key === 'Escape') setShowDialog(false);
                    }}
                >
                    <div className='modal-box max-w-md px-3.5 sm:px-5 w-full mx-2'>
                        <LoginForm
                            setShowDialog={setShowDialog}
                            showDialog={showDialog}
                        />
                    </div>
                </div>
            </ReactFocusLock>
        </ClientOnlyPortal>
    );
}
