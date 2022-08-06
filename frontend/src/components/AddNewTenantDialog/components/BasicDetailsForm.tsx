import { AiOutlineClose } from 'react-icons/ai';
import { FormInputBox } from '../../UI/FormInputBox';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { CreateNewTenantSchema } from '../AddNewTenantDialog';

export const basicFormSchema = z.object({
    name: z.string().min(2, 'name should be at least 2 character long'),
    email: z.string().email('email is not in correct format'),
    phone: z
        .string()
        .regex(new RegExp('^[6-9]\\d{9}$'), 'Phone number is invalid'),
    address: z.string().min(2),
});

export type BasicFormSchema = z.infer<typeof basicFormSchema>;

interface BasicDetailsFormProps {
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    showDialog: boolean;
    setFormStep: Dispatch<SetStateAction<number>>;
    finalFormDetails: MutableRefObject<CreateNewTenantSchema>;
}

export function BasicDetailsForm({
    showDialog,
    setShowDialog,
    setFormStep,
    finalFormDetails,
}: BasicDetailsFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<BasicFormSchema>({
        resolver: zodResolver(basicFormSchema),
    });

    const onSubmit = handleSubmit((formData) => {
        finalFormDetails.current = { ...formData };
        setFormStep((step) => step + 1);
    });

    useEffect(() => {
        if (showDialog) {
            setFocus('name');
        }
    }, [setFocus, showDialog]);

    function closeAndResetDialog() {
        reset();
        setShowDialog(false);
    }
    return (
        <form
            className='modal-box w-full mx-2  px-3.5 sm:px-5 max-w-md'
            onSubmit={onSubmit}
        >
            <div className='flex justify-between mb-5'>
                <h2 className='font-bold text-lg'>Add New Tenant</h2>
                <button
                    className='btn btn-circle btn-sm btn-outline'
                    type='reset'
                    onClick={closeAndResetDialog}
                >
                    <AiOutlineClose fontSize={18} />
                </button>
            </div>
            <ul className='steps text-sm mb-6 w-full'>
                <li className='step step-primary'>Basic Details</li>
                <li className='step'>Contact Details</li>
                <li className='step'>Documents Upload</li>
            </ul>
            <FormInputBox
                error={errors.name?.message}
                id='name'
                label={"Tenant's Name"}
                placeholder='Enter the name of the tenant'
                registerForm={register('name')}
                type='text'
            />
            <FormInputBox
                error={errors.address?.message}
                id='address'
                label={"Tenant's Address"}
                placeholder='Enter the Address of the tenant'
                registerForm={register('address')}
                type='text'
            />
            <div className='flex space-x-1 w-full'>
                <FormInputBox
                    error={errors.phone?.message}
                    id='phone'
                    label={"Tenant's Mobile"}
                    placeholder='Phone Number'
                    registerForm={register('phone')}
                    type='tel'
                />
                <FormInputBox
                    error={errors.email?.message}
                    id='email'
                    label={"Tenant's Email"}
                    placeholder='Email Address'
                    registerForm={register('email')}
                    type='email'
                />
            </div>

            <button className={clsx('btn btn-primary btn-block')} type='submit'>
                Next
            </button>
        </form>
    );
}
