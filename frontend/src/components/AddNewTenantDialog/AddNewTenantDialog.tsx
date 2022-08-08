import { Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { AiOutlineClose } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FocusTrap from 'focus-trap-react';
import { FormInputBox } from '../UI/FormInputBox';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';
import { useCreateNewTenantMutation } from '../../hooks/react-query/mutation/useCreateNewTenantMutation';

interface AddNewTenantDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    spaceId: number;
}

const formSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email is not in correct format'),
});

export type CreateNewTenantSchema = z.infer<typeof formSchema>;

export function AddNewTenantDialog({
    showDialog,
    setShowDialog,
    spaceId,
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
    const mutation = useCreateNewTenantMutation(spaceId, closeAndResetDialog);
    const onSubmit = handleSubmit((formData) => {
        mutation.mutate(formData);
    });

    function closeAndResetDialog() {
        reset();
        setShowDialog(false);
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
                    <IncreaseShareLimitDialog />
                </div>
            </FocusTrap>
        </ClientOnlyPortal>
    );
}

function IncreaseShareLimitDialog() {
    return (
        <div className='modal modal-open'>
            <div className='modal-box w-full mx-2  px-3.5 sm:px-5 max-w-sm'>
                <div className='space-y-2 mb-6'>
                    <h3 className='font-semibold text-lg'>Room Occupied</h3>
                    <p>
                        The room is already occupied, do you want to bump up the
                        sharing type?
                    </p>
                </div>
                <div className='space-y-3'>
                    <button className='btn w-full btn-primary'>
                        Bump up the sharing type
                    </button>
                    <button className='btn w-full btn-ghost'>Cancel</button>
                </div>
            </div>
        </div>
    );
}
