import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';

const formSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email should be in correct format'),
});

interface SignupStepOneFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

const inputClasses = (condition: boolean) =>
    clsx(
        'outline-offset-0 outline-1 border rounded-md w-full outline-none focus:outline-blue-600 p-1.5 bg-slate-100 text-sm',
        { 'outline outline-rose-300 focus:outline-rose-300': condition }
    );

export default function SignupStepOneForm({
    userDetails,
    setFormStep,
}: SignupStepOneFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = handleSubmit((formData) => {
        userDetails.current = { ...userDetails.current, ...formData };
        setFormStep((formStep) => formStep + 1);
        console.log(userDetails.current);
    });
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-2 px-4'>
                    <div className='space-y-1.5'>
                        <label htmlFor='name'>
                            <h2 className='text-sm font-semibold'>Name</h2>
                        </label>
                        <input
                            className={inputClasses(!!errors.name)}
                            id='name'
                            placeholder='What name would you like to have?'
                            type='text'
                            {...register('name')}
                        />
                        <p className='text-rose-600 text-sm'>
                            {errors.name && errors.name.message}
                        </p>
                    </div>
                    <div className='space-y-1.5'>
                        <label htmlFor='email'>
                            <h2 className='text-sm font-semibold'>Email</h2>
                        </label>
                        <input
                            className={inputClasses(!!errors.email)}
                            id='email'
                            placeholder='Your email'
                            type='email'
                            {...register('email')}
                        />
                        <p className='text-rose-600 text-sm'>
                            {errors.email && errors.email.message}
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
