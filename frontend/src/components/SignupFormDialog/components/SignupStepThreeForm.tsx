import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { UserDetails } from '../SignupFormDialog';

interface FormData {
    otp: string;
}

interface SignupStepTwoFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

export function SignupStepThreeForm({
    setFormStep,
    userDetails,
}: SignupStepTwoFormProps) {
    const { register, handleSubmit } = useForm<FormData>();
    const onSubmit = handleSubmit(() => {
        console.log(userDetails.current);
    });
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-4 px-4'>
                    <div className='space-y-2'>
                        <label className='space-y-1.5' htmlFor='otp'>
                            <h2 className='text-sm font-semibold'>
                                Confirm your email
                            </h2>
                            <p className='text-sm'>
                                Please enter the code we sent to
                                adfsadf@gmail.com
                            </p>
                        </label>
                        <input
                            autoComplete='one-time-code'
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100 text-sm'
                            id='otp'
                            inputMode='numeric'
                            placeholder='one time password'
                            type='text'
                            {...register('otp', { required: true })}
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
                            Create
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
