import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { FormInputBox } from '../../UI/FormInputBox';
import { useSendOTPMutation } from '../../../hooks/react-query/mutation/useSendOTPMutation';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface SignupStepTwoFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

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
    const mutation = useSendOTPMutation(setFormStep);
    const onSubmit = handleSubmit(async ({ confirmPassword, ...rest }) => {
        userDetails.current = { ...userDetails.current, ...rest };
        mutation.mutate(userDetails.current);
    });
    useEffect(() => {
        setFocus('password');
    }, [setFocus]);
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-2 px-4'>
                    <FormInputBox
                        error={errors.password?.message}
                        id='password'
                        label='Your Password'
                        placeholder='Enter Your Password'
                        registerForm={{
                            ...register('password', {
                                required: {
                                    value: true,
                                    message: 'password field is required',
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Minimum length should be 5',
                                },
                            }),
                        }}
                        type='password'
                    />
                    <FormInputBox
                        error={errors.confirmPassword?.message}
                        id='confirm-password'
                        label='Confirm Password'
                        placeholder='Confirm Your Password'
                        registerForm={register('confirmPassword', {
                            required: {
                                value: true,
                                message: 'Confirm password field is required',
                            },
                            validate: (val: string) => {
                                if (watch('password') != val) {
                                    return 'Passwords do no match';
                                }
                            },
                        })}
                        type='password'
                    />
                </div>
                <div className='space-y-2'>
                    <hr />
                    <div className='flex justify-end px-4'>
                        <button
                            className='btn btn-primary btn-sm'
                            type='submit'
                        >
                            {mutation.isLoading ? 'Sending OTP' : 'Next'}
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
