import { FormState, UseFormRegister } from 'react-hook-form';
import { CreateNewPropertySchema } from './AddNewPropertyDialog';
import { FormInputBox } from '../UI/FormInputBox';

interface FormControlProps {
    formState: FormState<CreateNewPropertySchema>;
    register: UseFormRegister<CreateNewPropertySchema>;
}
export function FormControl({ formState, register }: FormControlProps) {
    const { errors } = formState;
    return (
        <>
            <FormInputBox
                error={errors.name?.message}
                id='name'
                label='Property Name'
                placeholder="Enter Property's Name"
                registerForm={register('name')}
                type='text'
            />
            <FormInputBox
                error={errors.totalFloors?.message}
                id='total-floors'
                label='Total Floors'
                placeholder='Enter Total Number of Floors'
                registerForm={register('totalFloors', { valueAsNumber: true })}
                type='number'
            />
            <FormInputBox
                error={errors.address?.message}
                id='address'
                label='Address'
                placeholder='Where is this Property Located?'
                registerForm={register('address')}
                type='address'
            />
        </>
    );
}
