import clsx from 'clsx';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { CreateNewTenantSchema } from '../AddNewTenantDialog';
import { useCreateNewTenantMutation } from '../../../hooks/react-query/mutation/useCreateNewTenantMutation';

interface IncreaseShareLimitDialogProps {
    createNewTenantData: MutableRefObject<CreateNewTenantSchema | null>;
    showIncreaseShareLimitDialog: boolean;
    createMutation: ReturnType<typeof useCreateNewTenantMutation>;
    setShowIncreaseShareLimitDialog: Dispatch<SetStateAction<boolean>>;
}

export function IncreaseShareLimitDialog({
    createNewTenantData,
    showIncreaseShareLimitDialog,
    createMutation,
    setShowIncreaseShareLimitDialog,
}: IncreaseShareLimitDialogProps) {
    return (
        <div
            className={clsx('modal', {
                'modal-open': showIncreaseShareLimitDialog,
            })}
        >
            <div className='modal-box w-full mx-2  px-3.5 sm:px-5 max-w-sm'>
                <div className='space-y-2 mb-6'>
                    <h3 className='font-semibold text-lg'>Room Occupied</h3>
                    <p>
                        The room is already occupied, do you want to bump up the
                        sharing type?
                    </p>
                </div>
                <div className='space-y-3'>
                    <button
                        className='btn w-full btn-primary'
                        onClick={() => {
                            if (createNewTenantData.current)
                                createMutation.mutate(
                                    createNewTenantData.current
                                );
                        }}
                    >
                        Bump up the Room Share type
                    </button>
                    <button
                        className='btn w-full btn-ghost'
                        onClick={() => setShowIncreaseShareLimitDialog(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
