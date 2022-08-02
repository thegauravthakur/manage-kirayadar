import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';
import { FormInputBox } from '../../UI/FormInputBox';

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
    });
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='px-4'>
                    <FormInputBox
                        error={errors.name?.message}
                        id='name'
                        label='Your Name'
                        placeholder='Enter Your Name'
                        registerForm={register('name')}
                        type='text'
                    />
                    <FormInputBox
                        error={errors.email?.message}
                        id='email'
                        label='Your Email'
                        placeholder='Enter Your Email'
                        registerForm={register('email')}
                        type='email'
                    />
                </div>
                <div className='flex justify-end px-4'>
                    <button className='btn btn-primary btn-sm' type='submit'>
                        Next
                    </button>
                </div>
            </fieldset>
        </form>
    );
}
