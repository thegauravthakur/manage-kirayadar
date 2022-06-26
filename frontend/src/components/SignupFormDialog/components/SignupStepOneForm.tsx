import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { UserDetails } from '../SignupFormDialog';

interface FormData {
    name: string;
    email: string;
}

interface SignupStepOneFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

export default function SignupStepOneForm({
    userDetails,
    setFormStep,
}: SignupStepOneFormProps) {
    const { register, handleSubmit } = useForm<FormData>();
    const onSubmit = handleSubmit((formData) => {
        userDetails.current = { ...userDetails.current, ...formData };
        setFormStep((formStep) => formStep + 1);
    });
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-4 px-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='name'>
                            <h2 className='text-sm font-semibold'>Name</h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100 text-sm'
                            id='name'
                            placeholder='What name would you like to have?'
                            type='text'
                            {...register('name', { required: true })}
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='email'>
                            <h2 className='text-sm font-semibold'>Email</h2>
                        </label>
                        <input
                            className='border rounded-md w-full p-1.5 outline-none focus:ring bg-slate-100 text-sm'
                            id='email'
                            placeholder='Your email'
                            type='email'
                            {...register('email', { required: true })}
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
