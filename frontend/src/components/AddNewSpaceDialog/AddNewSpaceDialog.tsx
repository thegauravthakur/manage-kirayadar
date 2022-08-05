import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AiOutlineClose } from 'react-icons/ai';
import { createEmptyArray, numberToWord } from '../../helpers/pageHelper';
import { FormInputBox } from '../UI/FormInputBox';
import { FormSelectBox } from '../UI/FormSelectBox';
import FocusTrap from 'focus-trap-react';
import { useCreateNewSpaceMutation } from '../../hooks/react-query/mutation/useCreateNewSpaceMutation';
import ClientOnlyPortal from '../ClientOnlyPortal/ClientOnlyPortal';

const formSchema = z.object({
    name: z.string().min(2, 'name should have at least 2 letter'),
    floor: z.number().min(1, ''),
});

export type CreateNewSpaceSchema = z.infer<typeof formSchema>;

const getOptions = (totalFloors: number) => {
    const emptyArray = createEmptyArray(totalFloors - 1);
    return emptyArray.map((value) => ({
        value: numberToWord(value + 1) + ' floor',
        key: value + 1,
    }));
};

interface AddNewSpaceDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    totalFloors: number;
    propertyId: number;
}

export function AddNewSpaceDialog({
    showDialog,
    setShowDialog,
    totalFloors,
    propertyId,
}: AddNewSpaceDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<CreateNewSpaceSchema>({
        resolver: zodResolver(formSchema),
    });
    const mutation = useCreateNewSpaceMutation(propertyId, () => {
        reset();
        setShowDialog(false);
    });
    const options = getOptions(totalFloors);
    const modalRef = useRef<HTMLDivElement>(null);
    const onSubmit = handleSubmit((formData) => mutation.mutate(formData));

    useEffect(() => {
        if (showDialog) {
            setFocus('name');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            reset();
        }
    }, [reset, setFocus, showDialog]);

    return (
        <ClientOnlyPortal>
            <FocusTrap active={showDialog}>
                <div
                    ref={modalRef}
                    className={clsx('modal', {
                        'modal-open': showDialog,
                    })}
                    onKeyDown={({ key }) => {
                        if (key === 'Escape') setShowDialog(false);
                    }}
                >
                    <form
                        className='modal-box w-full mx-2 px-3.5 sm:px-5 max-w-md'
                        onSubmit={onSubmit}
                    >
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
                        <FormInputBox
                            error={errors.name?.message}
                            id='floor'
                            label='Name'
                            placeholder='Enter name for this space?'
                            registerForm={register('name')}
                            type='text'
                        />
                        <FormSelectBox
                            error={errors.floor?.message}
                            id='floor'
                            label='Chose Floor'
                            options={options}
                            registerForm={register('floor', {
                                valueAsNumber: true,
                            })}
                        />
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
            </FocusTrap>
        </ClientOnlyPortal>
    );
}
