import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { createNewUser } from '../../../helpers/userHelper';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { Sign } from 'crypto';

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
    const { register, handleSubmit } = useForm<FormData>();
    const onSubmit = handleSubmit(({ confirmPassword, ...rest }) => {
        userDetails.current = { ...userDetails.current, ...rest };
        setFormStep((step) => step + 1);
    });
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-4 px-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='password'>
                            <h2 className='text-sm font-semibold'>Password</h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100 text-sm'
                            id='password'
                            placeholder='Enter a strong password'
                            type='text'
                            {...register('password', { required: true })}
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='confirmPassword'>
                            <h2 className='text-sm font-semibold'>
                                Confirm Password
                            </h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100 text-sm'
                            id='confirmPassword'
                            placeholder='Re-enter password'
                            type='email'
                            {...register('confirmPassword', { required: true })}
                        />
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
