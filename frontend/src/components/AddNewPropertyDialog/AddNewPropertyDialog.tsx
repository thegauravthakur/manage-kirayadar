import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineClose } from 'react-icons/ai';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { Session, useSession } from '../../hooks/useSession';
import { useSnackbar } from '../../hooks/zustand/useSnackbar';
import { CustomError } from '../../types';
import ReactFocusLock from 'react-focus-lock';

interface AddNewPropertyDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    totalFloors: z.number().min(1, 'Property should contain at least 1 floor'),
});

type FormSchema = z.infer<typeof formSchema>;

async function createNewProperty(
    formData: FormSchema,
    { token }: Session['session']
) {
    const response = await postWithToken(
        createEndpoint('property/add'),
        token,
        {
            ...formData,
        }
    );
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
}

export function AddNewPropertyDialog({
    showDialog,
    setShowDialog,
}: AddNewPropertyDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const queryClient = useQueryClient();
    const { session } = useSession();
    const { show } = useSnackbar();
    const mutation = useMutation(
        async (formData: FormSchema) => {
            if (session) return createNewProperty(formData, session);
        },
        {
            onError: (error: CustomError) =>
                show(error.errorMessage ?? '', 'error'),
            onSuccess: async () => {
                show('created a new property', 'success');
                await queryClient.invalidateQueries('properties');
                setShowDialog(false);
            },
        }
    );
    const onSubmit = handleSubmit((formData) => mutation.mutate(formData));
    return (
        <ReactFocusLock>
            <div
                className={clsx('modal', {
                    'modal-open': showDialog,
                })}
            >
                <form className='modal-box' onSubmit={onSubmit}>
                    <div className='flex justify-between mb-5'>
                        <h2 className='font-bold text-lg'>Add New Property</h2>
                        <button
                            className='btn btn-circle btn-sm btn-outline'
                            type='button'
                            onClick={() => {
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
                            { 'input-error': !!errors.name }
                        )}
                        id='name'
                        placeholder='Enter a name...'
                        type='text'
                        {...register('name')}
                    />
                    <label className='label'>
                        <span className='label-text-alt text-error'>
                            {errors.name && errors.name.message} &nbsp;
                        </span>
                    </label>
                    <label className='label' htmlFor='totalFloors'>
                        <span className='label-text'>
                            How many floors are there?
                        </span>
                    </label>
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.totalFloors }
                        )}
                        id='totalFloors'
                        placeholder='total number of floors...'
                        type='text'
                        {...register('totalFloors', { valueAsNumber: true })}
                    />
                    <label className='label'>
                        <span className='label-text-alt text-error'>
                            {errors.totalFloors && errors.totalFloors.message}{' '}
                            &nbsp;
                        </span>
                    </label>
                    <label className='label' htmlFor='address'>
                        <span className='label-text'>
                            Where is this property located?
                        </span>
                    </label>
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.name }
                        )}
                        id='address'
                        placeholder='Enter city name...'
                        type='text'
                        {...register('address')}
                    />
                    <label className='label'>
                        <span className='label-text-alt text-error'>
                            {errors.address && errors.address.message} &nbsp;
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
        </ReactFocusLock>
    );
}
