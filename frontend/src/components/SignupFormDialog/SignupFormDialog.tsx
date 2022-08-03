import { AiOutlineClose } from 'react-icons/ai';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import FocusLock from 'focus-trap-react';
import clsx from 'clsx';
import SignupStepOneForm from './components/SignupStepOneForm';
import { SignupStepTwoForm } from './components/SignupStepTwoForm';
import { SignupStepThreeForm } from './components/SignupStepThreeForm';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';

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
    const [formStep, setFormStep] = useState(1);
    const userDetails = useRef<UserDetails>({ ...initialValues });

    useEffect(() => {
        if (showDialog) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [showDialog]);

    if (!showDialog) return null;
    //todo: use modal class here
    return (
        <ClientOnlyPortal>
            <FocusLock>
                <div
                    className={clsx(
                        'border absolute shadow-lg rounded-lg',
                        'w-full max-w-lg h-[350px] md:h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col'
                    )}
                >
                    <div className={clsx('flex items-center px-4 py-2.5')}>
                        <h2
                            className={clsx(
                                'font-bold text-lg flex-1 text-center'
                            )}
                        >
                            Create new account
                        </h2>
                        <button
                            className='btn btn-circle btn-outline btn-sm'
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
            </FocusLock>
        </ClientOnlyPortal>
    );
}
