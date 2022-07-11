import { AiOutlineClose } from 'react-icons/ai';
import { Dispatch, SetStateAction, useRef } from 'react';
import ReactFocusLock from 'focus-trap-react';
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
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <ReactFocusLock active={showDialog}>
            <div className={clsx('modal', { 'modal-open': showDialog })}>
                <div className='modal-box'>
                    <div className={clsx('flex items-center px-4 py-2.5')}>
                        <h2
                            className={clsx(
                                'font-bold text-lg flex-1 text-center'
                            )}
                        >
                            Login to your account
                        </h2>
                        <button
                            className='btn btn-circle btn-sm btn-outline'
                            type='button'
                            onClick={() => {
                                if (formRef.current) formRef.current.reset();
                                setShowDialog(false);
                            }}
                        >
                            <AiOutlineClose fontSize={18} />
                        </button>
                    </div>
                    <hr />
                    <LoginForm formRef={formRef} showDialog={showDialog} />
                </div>
            </div>
        </ReactFocusLock>
    );
}
