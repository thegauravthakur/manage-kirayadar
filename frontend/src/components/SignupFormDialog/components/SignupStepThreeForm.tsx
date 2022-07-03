import { useForm } from 'react-hook-form';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { UserDetails } from '../SignupFormDialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useMutation } from 'react-query';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { CustomError } from '../../../types';
import { useSnackbar } from '../../../hooks/zustand/useSnackbar';

interface SignupStepTwoFormProps {
    userDetails: MutableRefObject<UserDetails>;
    setFormStep: Dispatch<SetStateAction<number>>;
}

const formSchema = z.object({
    otp: z.string().length(6, 'OTP should be 6 digit'),
});

async function createUser(userDetails: UserDetails, otp: string) {
    const response = await postWithData(createEndpoint('user/create'), {
        ...userDetails,
        otp,
    });
    const result: JSONResponse = await response.json();
    if (!response.ok) throw result;
    return result;
}

const inputClasses = (condition: boolean) =>
    clsx(
        'outline-offset-0 outline-1 border rounded-md w-full outline-none focus:outline-blue-600 p-1.5 bg-slate-100 text-sm',
        { 'outline outline-rose-300 focus:outline-rose-300': condition }
    );

export function SignupStepThreeForm({ userDetails }: SignupStepTwoFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { show } = useSnackbar();
    const mutation = useMutation(
        async (otp: string) => createUser(userDetails.current, otp),
        {
            onSuccess: () => router.push('/'),
            onError(error: CustomError) {
                if (error.errorMessage) {
                    show(error.errorMessage, 'error');
                }
            },
        }
    );
    const onSubmit = handleSubmit(({ otp }) => {
        mutation.mutate(otp);
    });
    useEffect(() => {
        setFocus('otp');
    }, [setFocus]);
    return (
        <form className='space-y-6 py-3 w-full flex-1' onSubmit={onSubmit}>
            <fieldset className='h-full flex flex-col justify-between'>
                <div className='space-y-2 px-4'>
                    <div className='space-y-2'>
                        <label className='space-y-1.5' htmlFor='otp'>
                            <h2 className='text-sm font-semibold'>
                                Confirm your email
                            </h2>
                            <p className='text-sm'>
                                Please enter the code we sent to{' '}
                                {userDetails.current.email}
                            </p>
                        </label>
                        <input
                            autoComplete='one-time-code'
                            className={inputClasses(!!errors.otp)}
                            id='otp'
                            inputMode='numeric'
                            placeholder='one time password'
                            type='text'
                            {...register('otp')}
                        />
                        <p className='text-rose-600 text-sm'>
                            {errors.otp && errors.otp.message}
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
                            Create
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
