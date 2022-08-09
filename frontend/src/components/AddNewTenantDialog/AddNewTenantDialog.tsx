import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AiOutlineClose } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FocusTrap from 'focus-trap-react';
import { FormInputBox } from '../UI/FormInputBox';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';
import { useCreateNewTenantMutation } from '../../hooks/react-query/mutation/useCreateNewTenantMutation';
import { Space } from '../../types';
import { IncreaseShareLimitDialog } from './components/IncreaseShareLimitDialog';
import { useSnackbar } from '../../hooks/zustand/useSnackbar';

interface AddNewTenantDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    space: Space;
}

const formSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email is not in correct format'),
});

export type CreateNewTenantSchema = z.infer<typeof formSchema>;

export function AddNewTenantDialog({
    showDialog,
    setShowDialog,
    space,
}: AddNewTenantDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<CreateNewTenantSchema>({
        resolver: zodResolver(formSchema),
    });
    const snackbar = useSnackbar();
    const [showIncreaseShareLimitDialog, setShowIncreaseShareLimitDialog] =
        useState(false);
    const mutation = useCreateNewTenantMutation(space.id, closeAndResetDialog);
    const createNewTenantData = useRef<CreateNewTenantSchema | null>(null);

    const onSubmit = handleSubmit((formData) => {
        createNewTenantData.current = formData;
        if (space.totalTenants < space.sharingType) {
            mutation.mutate(formData);
        } else if (space.sharingType === 10) {
            snackbar.show("Can't add tenants more than 10", 'error');
        } else setShowIncreaseShareLimitDialog(true);
    });

    function closeAndResetDialog() {
        reset();
        setShowDialog(false);
        setShowIncreaseShareLimitDialog(false);
    }

    useEffect(() => {
        if (showDialog) {
            setFocus('name');
            document.body.style.overflow = 'hidden';
        } else document.body.style.overflow = 'unset';
    }, [setFocus, showDialog]);

    return (
        <ClientOnlyPortal>
            <FocusTrap active={showDialog}>
                <div
                    className={clsx('modal', {
                        'modal-open': showDialog,
                    })}
                    onKeyDown={({ key }) => {
                        if (key === 'Escape') setShowDialog(false);
                    }}
                >
                    <form
                        className='modal-box w-full mx-2  px-3.5 sm:px-5 max-w-md'
                        onSubmit={onSubmit}
                    >
                        <div className='flex justify-between mb-5'>
                            <h2 className='font-bold text-lg'>
                                Add New Tenant
                            </h2>
                            <button
                                className='btn btn-circle btn-sm btn-outline'
                                type='reset'
                                onClick={closeAndResetDialog}
                            >
                                <AiOutlineClose fontSize={18} />
                            </button>
                        </div>
                        <FormInputBox
                            error={errors.name?.message}
                            id='name'
                            label={"Tenant's Name"}
                            placeholder='Enter the name of the tenant...'
                            registerForm={register('name')}
                            type='text'
                        />
                        <FormInputBox
                            error={errors.email?.message}
                            id='email'
                            label={"Tenant's Email"}
                            placeholder='Enter the email of the tenant...'
                            registerForm={register('email')}
                            type='email'
                        />
                        <button
                            className={clsx('btn btn-primary btn-block', {
                                loading: mutation.isLoading,
                            })}
                            type='submit'
                        >
                            create new tenant
                        </button>
                    </form>
                    <IncreaseShareLimitDialog
                        createMutation={mutation}
                        createNewTenantData={createNewTenantData}
                        setShowIncreaseShareLimitDialog={
                            setShowIncreaseShareLimitDialog
                        }
                        showIncreaseShareLimitDialog={
                            showIncreaseShareLimitDialog
                        }
                    />
                </div>
            </FocusTrap>
        </ClientOnlyPortal>
    );
}
