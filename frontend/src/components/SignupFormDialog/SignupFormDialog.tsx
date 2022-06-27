import { AiOutlineClose } from 'react-icons/ai';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactFocusLock from 'react-focus-lock';
import { useClickAwayListener } from '../../hooks/useClickAwayListener';
import clsx from 'clsx';
import SignupStepOneForm from './components/SignupStepOneForm';
import { SignupStepTwoForm } from './components/SignupStepTwoForm';
import { SignupStepThreeForm } from './components/SignupStepThreeForm';

interface SignUpDialogProps {
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    showDialog: boolean;
}
export interface UserDetails {
    name: string;
    email: string;
    password: string;
}

const initialValues = {
    name: '',
    email: '',
    password: '',
};

export function SignupFormDialog({
    setShowDialog,
    showDialog,
}: SignUpDialogProps) {
    const dialogFormRef = useRef<HTMLDivElement>(null);
    const [formStep, setFormStep] = useState(1);
    const userDetails = useRef<UserDetails>({ ...initialValues });
    useClickAwayListener(() => {
        setShowDialog(false);
        setFormStep(1);
        userDetails.current = { ...initialValues };
    }, dialogFormRef);

    if (!showDialog) return null;

    const content = (
        <ReactFocusLock>
            <div
                ref={dialogFormRef}
                className={clsx(
                    'border absolute shadow-lg rounded-lg',
                    'w-full max-w-lg h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col'
                )}
            >
                <div className={clsx('flex items-center px-4 py-2.5')}>
                    <h2
                        className={clsx('font-bold text-lg flex-1 text-center')}
                    >
                        Create new account
                    </h2>
                    <button
                        className={clsx(
                            'bg-gray-200 rounded-full p-2 box-content',
                            'hover:bg-gray-300'
                        )}
                        type='button'
                        onClick={() => {
                            setShowDialog(false);
                            setFormStep(1);
                            userDetails.current = { ...initialValues };
                        }}
                    >
                        <AiOutlineClose fontSize={18} />
                    </button>
                </div>
                <hr />
                {formStep === 1 && (
                    <SignupStepOneForm
                        setFormStep={setFormStep}
                        userDetails={userDetails}
                    />
                )}
                {formStep === 2 && (
                    <SignupStepTwoForm
                        setFormStep={setFormStep}
                        userDetails={userDetails}
                    />
                )}
                {formStep === 3 && (
                    <SignupStepThreeForm
                        setFormStep={setFormStep}
                        userDetails={userDetails}
                    />
                )}
            </div>
        </ReactFocusLock>
    );

    return document.body ? createPortal(content, document.body) : null;
}
