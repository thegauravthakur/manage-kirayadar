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
    phone: z
        .string()
        .regex(new RegExp('^[6-9]\\d{9}$'), 'Phone number is invalid'),
    address: z.string().min(2),
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
                            placeholder='Enter the name of the tenant'
                            registerForm={register('name')}
                            type='text'
                        />
                        <FormInputBox
                            error={errors.address?.message}
                            id='address'
                            label={"Tenant's Address"}
                            placeholder='Enter the Address of the tenant'
                            registerForm={register('address')}
                            type='text'
                        />
                        <div className='flex space-x-1 w-full'>
                            <FormInputBox
                                error={errors.phone?.message}
                                id='phone'
                                label={"Tenant's Mobile"}
                                placeholder='Phone Number'
                                registerForm={register('phone')}
                                type='tel'
                            />
                            <FormInputBox
                                error={errors.email?.message}
                                id='email'
                                label={"Tenant's Email"}
                                placeholder='Email Address'
                                registerForm={register('email')}
                                type='email'
                            />
                        </div>

                        <button
                            className={clsx('btn btn-primary btn-block', {
                                loading: mutation.isLoading,
                            })}
                            type='submit'
                        >
                            create new tenant
                        </button>
                    </form>
                </div>
            </FocusTrap>
        </ClientOnlyPortal>
    );
}
