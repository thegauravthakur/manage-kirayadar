import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { AiOutlineClose } from 'react-icons/ai';

const formSchema = z.object({
    email: z.string().email({ message: 'email not properly formatted' }),
    password: z.string().min(1, 'password is required'),
});

type FormSchema = z.infer<typeof formSchema>;

interface AddNewSpaceDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export function AddNewSpaceDialog({
    showDialog,
    setShowDialog,
}: AddNewSpaceDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const mutation = useMutation(async () => {});
    const onSubmit = handleSubmit(() => {});
    return (
        <div
            className={clsx('modal', {
                'modal-open': showDialog,
            })}
        >
            <form className='modal-box' onSubmit={onSubmit}>
                <div className='flex justify-between mb-5'>
                    <h2 className='font-bold text-lg'>Add New Space</h2>
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
                <label className='label' htmlFor='name'>
                    <span className='label-text'>
                        What is name of this property?
                    </span>
                </label>
                <input
                    className={clsx(
                        'input input-bordered input-primary input-md w-full',
                        { 'input-error': !!errors.email }
                    )}
                    id='name'
                    placeholder='Enter a name...'
                    type='text'
                    {...register('email')}
                />
                <label className='label'>
                    <span className='label-text-alt text-error'>
                        {errors.email && errors.email.message} &nbsp;
                    </span>
                </label>
                <label className='label' htmlFor='address'>
                    <span className='label-text'>How many beds are there?</span>
                </label>
                <input
                    className={clsx(
                        'input input-bordered input-primary input-md w-full',
                        { 'input-error': !!errors.password }
                    )}
                    id='address'
                    placeholder='Enter city name...'
                    type='text'
                    {...register('password')}
                />
                <label className='label'>
                    <span className='label-text-alt text-error'>
                        {errors.password && errors.password.message} &nbsp;
                    </span>
                </label>
                <button
                    className={clsx('btn btn-primary btn-block', {
                        loading: mutation.isLoading,
                    })}
                    type='submit'
                >
                    create new property
                </button>
            </form>
        </div>
    );
}
