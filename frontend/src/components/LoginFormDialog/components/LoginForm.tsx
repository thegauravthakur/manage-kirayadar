import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLabel } from '../../FormLabel';
import { AiOutlineClose } from 'react-icons/ai';
import { useLoginMutation } from '../../../hooks/react-query/mutation/useLoginMutation';

const formSchema = z.object({
    email: z.string().email({ message: 'email not properly formatted' }),
    password: z.string().min(1, 'password is required'),
});

export type LoginFormSchema = z.infer<typeof formSchema>;

interface LoginFormProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export function LoginForm({ showDialog, setShowDialog }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
        reset,
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(formSchema),
    });
    const mutation = useLoginMutation();
    const onSubmit = handleSubmit((formData) => mutation.mutate(formData));

    useEffect(() => {
        if (showDialog) setFocus('email');
    }, [setFocus, showDialog]);

    return (
        <>
            <div className='flex justify-between mb-5'>
                <h2 className='font-bold text-lg'>Add New Property</h2>
                <button
                    className='btn btn-circle btn-sm btn-outline'
                    type='button'
                    onClick={() => {
                        reset();
                        setShowDialog(false);
                    }}
                >
                    <AiOutlineClose fontSize={18} />
                </button>
            </div>
            <form method='post' onSubmit={onSubmit}>
                <FormLabel
                    errorText={errors.email?.message}
                    id='email'
                    labelText='What is your email'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.email }
                        )}
                        id='email'
                        placeholder='Your email...'
                        type='email'
                        {...register('email')}
                    />
                </FormLabel>
                <FormLabel
                    errorText={errors.password?.message}
                    id='password'
                    labelText='What is your password?'
                >
                    <input
                        className={clsx(
                            'input input-bordered input-primary input-md w-full',
                            { 'input-error': !!errors.password }
                        )}
                        id='password'
                        placeholder='Your password...'
                        type='password'
                        {...register('password')}
                    />
                </FormLabel>
                <button
                    className={clsx('btn btn-primary btn-block mt-5', {
                        loading: mutation.isLoading,
                    })}
                    type='submit'
                >
                    Login
                </button>
            </form>
        </>
    );
}
