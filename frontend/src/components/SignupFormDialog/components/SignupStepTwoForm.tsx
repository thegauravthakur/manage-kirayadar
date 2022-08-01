import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { UserDetails } from '../SignupFormDialog';
import clsx from 'clsx';
import { createEndpoint, postWithData } from '../../../helpers/fetchHelper';
import { useMutation } from 'react-query';
import { FormInputBox } from '../../UI/FormInputBox';

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
    const mutation = useMutation(
        async (data: UserDetails) => {
            await postWithData(createEndpoint('otp/generate'), {
                email: data.email,
            });
        },
        { onSuccess: () => setFormStep((step) => step + 1) }
    );
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
                        <button className='btn btn-primary' type='submit'>
                            {mutation.isLoading ? 'Sending OTP' : 'Next'}
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
