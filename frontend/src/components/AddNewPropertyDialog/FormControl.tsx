import { FormLabel } from '../FormLabel';
import clsx from 'clsx';
import { FormState, UseFormRegister } from 'react-hook-form';
import { CreateNewPropertySchema } from './AddNewPropertyDialog';

interface FormControlProps {
    formState: FormState<CreateNewPropertySchema>;
    register: UseFormRegister<CreateNewPropertySchema>;
}
export function FormControl({ formState, register }: FormControlProps) {
    const { errors } = formState;
    return (
        <>
            <FormLabel
                errorText={errors.name?.message}
                id='name'
                labelText='What is name of this property?'
            >
                <input
                    className={clsx(
                        'input input-bordered input-primary input-md w-full',
                        { 'input-error': !!errors.name }
                    )}
                    id='name'
                    placeholder='Enter a name...'
                    type='text'
                    {...register('name')}
                />
            </FormLabel>
            <FormLabel
                errorText={errors.totalFloors?.message}
                id='totalFloors'
                labelText='How many floors are there?'
            >
                <input
                    className={clsx(
                        'input input-bordered input-primary input-md w-full',
                        { 'input-error': !!errors.totalFloors }
                    )}
                    id='totalFloors'
                    placeholder='total number of floors...'
                    type='text'
                    {...register('totalFloors', {
                        valueAsNumber: true,
                    })}
                />
            </FormLabel>
            <FormLabel
                errorText={errors.address?.message}
                id='address'
                labelText='Where is this property located?'
            >
                <input
                    className={clsx(
                        'input input-bordered input-primary input-md w-full',
                        { 'input-error': !!errors.address }
                    )}
                    id='address'
                    placeholder='Enter city name...'
                    type='text'
                    {...register('address')}
                />
            </FormLabel>
        </>
    );
}
