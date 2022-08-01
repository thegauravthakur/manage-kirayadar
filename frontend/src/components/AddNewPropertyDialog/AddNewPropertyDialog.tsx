import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineClose } from 'react-icons/ai';
import ReactFocusLock from 'focus-trap-react';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';
import { useCreateNewPropertyMutation } from '../../hooks/react-query/mutation/useCreateNewPropertyMutation';
import { FormControl } from './FormControl';

interface AddNewPropertyDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    totalFloors: z
        .number({ invalid_type_error: 'A number is required' })
        .min(1, 'Property should contain at least 1 floor'),
});

export type CreateNewPropertySchema = z.infer<typeof formSchema>;

export function AddNewPropertyDialog({
    showDialog,
    setShowDialog,
}: AddNewPropertyDialogProps) {
    const { register, handleSubmit, reset, formState } =
        useForm<CreateNewPropertySchema>({
            resolver: zodResolver(formSchema),
        });
    const { mutate, isLoading } = useCreateNewPropertyMutation(setShowDialog);
    const onSubmit = handleSubmit((formData) => mutate(formData));
    function onCloseIconClick() {
        reset();
        setShowDialog(false);
    }
    return (
        <ClientOnlyPortal>
            <ReactFocusLock active={showDialog}>
                <div
                    className={clsx('modal', {
                        'modal-open': showDialog,
                    })}
                >
                    <form className='modal-box w-full' onSubmit={onSubmit}>
                        <div className='flex justify-between mb-5'>
                            <h2 className='font-bold text-lg'>
                                Add New Property
                            </h2>
                            <button
                                className='btn btn-circle btn-sm btn-outline'
                                type='reset'
                                onClick={onCloseIconClick}
                            >
                                <AiOutlineClose fontSize={18} />
                            </button>
                        </div>
                        <FormControl
                            formState={formState}
                            register={register}
                        />
                        <button
                            className={clsx('btn btn-primary btn-block', {
                                loading: isLoading,
                            })}
                            type='submit'
                        >
                            create new property
                        </button>
                    </form>
                </div>
            </ReactFocusLock>
        </ClientOnlyPortal>
    );
}
