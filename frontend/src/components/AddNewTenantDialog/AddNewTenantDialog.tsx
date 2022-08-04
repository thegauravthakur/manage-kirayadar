import { Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { AiOutlineClose } from 'react-icons/ai';
import { FormLabel } from '../FormLabel';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from 'react-query';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { useSession } from '../../hooks/useSession';
import FocusTrap from 'focus-trap-react';

interface AddNewTenantDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    spaceId: number;
}

const formSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email is not in correct format'),
});

type FormSchema = z.infer<typeof formSchema>;

async function addNewTenant(
    formSchema: FormSchema,
    token: string,
    spaceId: number
) {
    const response = await postWithToken(createEndpoint('tenant/add'), token, {
        ...formSchema,
        spaceId,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}

export function AddNewTenantDialog({
    showDialog,
    setShowDialog,
    spaceId,
}: AddNewTenantDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const { token } = useSession();
    const queryClient = useQueryClient();
    const mutation = useMutation(
        async (formData: FormSchema) => {
            await addNewTenant(formData, token!, spaceId);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['tenants', spaceId]);
                reset();
                setShowDialog(false);
            },
        }
    );
    const onSubmit = handleSubmit((formData) => {
        mutation.mutate(formData);
    });

    return (
        <FocusTrap active={showDialog}>
            <div
                className={clsx('modal', {
                    'modal-open': showDialog,
                })}
            >
                <form className='modal-box space-y-5' onSubmit={onSubmit}>
                    <div>
                        <div className='flex justify-between mb-5'>
                            <h2 className='font-bold text-lg'>
                                Add New Tenant
                            </h2>
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
    );
}
