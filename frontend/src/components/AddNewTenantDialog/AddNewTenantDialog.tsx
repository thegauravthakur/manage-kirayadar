import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';
import {
    BasicDetailsForm,
    BasicFormSchema,
} from './components/BasicDetailsForm';

interface AddNewTenantDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    spaceId: number;
}

export type CreateNewTenantSchema = Partial<BasicFormSchema>;

export function AddNewTenantDialog({
    showDialog,
    setShowDialog,
    spaceId,
}: AddNewTenantDialogProps) {
    const finalFormDetails = useRef<CreateNewTenantSchema>({});
    const [formStep, setFormStep] = useState(0);
    useEffect(() => {
        if (showDialog) {
            document.body.style.overflow = 'hidden';
        } else document.body.style.overflow = 'unset';
    }, [showDialog]);

    return (
        <ClientOnlyPortal>
            <FocusTrap active={showDialog}>
                <div
                    className={clsx('modal', {
                        'modal-open': showDialog,
                    })}
                >
                    <BasicDetailsForm
                        finalFormDetails={finalFormDetails}
                        setFormStep={setFormStep}
                        setShowDialog={setShowDialog}
                        showDialog={showDialog}
                    />
                </div>
            </FocusTrap>
        </ClientOnlyPortal>
    );
}
