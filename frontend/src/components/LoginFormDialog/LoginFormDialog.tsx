import { AiOutlineClose } from 'react-icons/ai';
import { Dispatch, SetStateAction, useRef } from 'react';
import { createPortal } from 'react-dom';
import ReactFocusLock from 'react-focus-lock';
import clsx from 'clsx';
import { LoginForm } from './components/LoginForm';

interface SignUpDialogProps {
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    showDialog: boolean;
}
export function LoginFormDialog({
    setShowDialog,
    showDialog,
}: SignUpDialogProps) {
    if (!showDialog) return null;

    const content = (
        <ReactFocusLock>
            <div
                className={clsx(
                    'border absolute shadow-lg rounded-lg',
                    'w-full max-w-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white'
                )}
            >
                <div className={clsx('flex items-center px-4 py-2.5')}>
                    <h2
                        className={clsx('font-bold text-lg flex-1 text-center')}
                    >
                        Login to your account
                    </h2>
                    <button
                        className={clsx(
                            'bg-gray-200 rounded-full p-2 box-content',
                            'hover:bg-gray-300'
                        )}
                        type='button'
                        onClick={() => {
                            setShowDialog(false);
                        }}
                    >
                        <AiOutlineClose fontSize={18} />
                    </button>
                </div>
                <hr />
                <LoginForm />
            </div>
        </ReactFocusLock>
    );

    return document.body ? createPortal(content, document.body) : null;
}
