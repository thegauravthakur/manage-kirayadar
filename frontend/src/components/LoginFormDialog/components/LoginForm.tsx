import { useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineClose } from 'react-icons/ai';
import { useLoginMutation } from '../../../hooks/react-query/mutation/useLoginMutation';
import { FormInputBox } from '../../UI/FormInputBox';

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
        <form method='post' onSubmit={onSubmit}>
            <div className='flex justify-between mb-5'>
                <h2 className='font-bold text-lg'>Login to your account</h2>
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
            <FormInputBox
                error={errors.email?.message}
                id='email'
                label='Your Email'
                placeholder='Enter Your Email'
                registerForm={register('email')}
                type='email'
            />
            <FormInputBox
                error={errors.password?.message}
                id='password'
                label='Your Password'
                placeholder='Enter Your Password'
                registerForm={register('password')}
                type='password'
            />
            <button
                className={clsx('btn btn-primary btn-block', {
                    loading: mutation.isLoading,
                })}
                type='submit'
            >
                Login
            </button>
        </form>
    );
}
