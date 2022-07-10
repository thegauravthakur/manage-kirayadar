import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { AiOutlineClose } from 'react-icons/ai';
import { FormLabel } from '../FormLabel';
import { numberToWord } from '../../helpers/pageHelper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';

interface AddNewTenantDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email is not in correct format'),
});

type FormSchema = z.infer<typeof formSchema>;

export function AddNewTenantDialog({
    showDialog,
    setShowDialog,
}: AddNewTenantDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const mutation = useMutation(async () => {});
    const onSubmit = handleSubmit(() => {
        mutation.mutate();
    });
    return (
        <div
            className={clsx('modal', {
                'modal-open': showDialog,
            })}
        >
            <form className='modal-box' onSubmit={onSubmit}>
                <div className='flex justify-between mb-5'>
                    <h2 className='font-bold text-lg'>Add New Tenant</h2>
                    <button
                        className='btn btn-circle btn-sm btn-outline'
                        type='reset'
                        onClick={() => {
                            reset();
                            setShowDialog(false);
                        }}
                    >
                        <AiOutlineClose fontSize={18} />
                    </button>
                </div>
                <FormLabel
                    errorText={errors.name?.message}
                    id='name'
                    labelText='What is name of the tenant?'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.name }
                        )}
                        id='name'
                        placeholder='name...'
                        type='text'
                        {...register('name')}
                    />
                </FormLabel>
                <FormLabel
                    errorText={errors.email?.message}
                    id='email'
                    labelText='What is the email of the tenant?'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.email }
                        )}
                        id='name'
                        placeholder='email...'
                        type='text'
                        {...register('email')}
                    />
                </FormLabel>
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
    );
}
