import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { z } from 'zod';
import clsx from 'clsx';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface SignupStepTwoFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

const inputClasses = (condition: boolean) =>
    clsx(
        'outline-offset-0 outline-1 border rounded-md w-full outline-none focus:outline-blue-600 p-1.5 bg-slate-100 text-sm',
        { 'outline outline-rose-300 focus:outline-rose-300': condition }
    );

export function SignupStepTwoForm({
    setFormStep,
    userDetails,
}: SignupStepTwoFormProps) {
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
        watch,
    } = useForm<FormData>();
    const onSubmit = handleSubmit(({ confirmPassword, ...rest }) => {
        userDetails.current = { ...userDetails.current, ...rest };
        setFormStep((step) => step + 1);
    });
    useEffect(() => {
        setFocus('password');
    }, [setFocus]);
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-2 px-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='password'>
                            <h2 className='text-sm font-semibold'>Password</h2>
                        </label>
                        <input
                            className={inputClasses(!!errors.password)}
                            id='password'
                            placeholder='Enter a strong password'
                            type='password'
                            {...register('password', {
                                required: {
                                    value: true,
                                    message: 'password field is required',
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Minimum length should be 5',
                                },
                            })}
                        />
                        <p className='text-rose-600 text-sm'>
                            {errors.password && errors.password.message}
                        </p>
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='confirmPassword'>
                            <h2 className='text-sm font-semibold'>
                                Confirm Password
                            </h2>
                        </label>
                        <input
                            className={inputClasses(!!errors.confirmPassword)}
                            id='confirmPassword'
                            placeholder='Re-enter password'
                            type='password'
                            {...register('confirmPassword', {
                                required: true,
                                validate: (val: string) => {
                                    if (watch('password') != val) {
                                        return 'Passwords do no match';
                                    }
                                },
                            })}
                        />
                        <p className='text-rose-600 text-sm'>
                            {errors.confirmPassword &&
                                errors.confirmPassword.message}
                        </p>
                    </div>
                </div>
                <div className='space-y-2'>
                    <hr />
                    <div className='flex justify-end px-4'>
                        <button
                            className='py-1.5 px-3 border rounded-lg bg-blue-600 text-white outline-none focus:ring text-right text-sm'
                            type='submit'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
