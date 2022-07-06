import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { AiOutlineClose } from 'react-icons/ai';
import { createEmptyArray, numberToWord } from '../../helpers/pageHelper';
import { FormLabel } from '../FormLabel';

const formSchema = z.object({
    name: z.string().min(2, 'name should have at least 2 letter'),
    floor: z.number().min(1, ''),
});

type FormSchema = z.infer<typeof formSchema>;

interface AddNewSpaceDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    totalFloors: number;
}

export function AddNewSpaceDialog({
    showDialog,
    setShowDialog,
    totalFloors,
}: AddNewSpaceDialogProps) {
    const emptyArray = createEmptyArray(totalFloors - 1);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const mutation = useMutation(async () => {});
    const onSubmit = handleSubmit((formData) => {
        console.log(formData);
    });
    return (
        <div
            className={clsx('modal', {
                'modal-open': showDialog,
            })}
        >
            <form className='modal-box' onSubmit={onSubmit}>
                <div className='flex justify-between mb-5'>
                    <h2 className='font-bold text-lg'>Add New Space</h2>
                    <button
                        className='btn btn-circle btn-sm btn-outline'
                        type='reset'
                        onClick={() => {
                            reset();
                            setShowDialog(false);
                        }}
                    >
                        <AiOutlineClose fontSize={18} />
                    </button>
                </div>
                <FormLabel
                    errorText={errors.name?.message}
                    id='name'
                    labelText='What is name of this property'
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
                    errorText={errors.floor?.message}
                    id='floor'
                    labelText='What floor is this space on?'
                >
                    <select
                        className={clsx(
                            'select select-primary font-normal w-full',
                            {
                                'select-error': !!errors.floor,
                            }
                        )}
                        defaultValue={1}
                        {...register('floor', { valueAsNumber: true })}
                    >
                        {emptyArray.map((value) => (
                            <option key={value} value={value + 1}>
                                {numberToWord(value + 1)} floor
                            </option>
                        ))}
                    </select>
                </FormLabel>
                <button
                    className={clsx('btn btn-primary btn-block', {
                        loading: mutation.isLoading,
                    })}
                    type='submit'
                >
                    create new space
                </button>
            </form>
        </div>
    );
}
