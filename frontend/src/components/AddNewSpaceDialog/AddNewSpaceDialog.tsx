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

const SpaceType = [
    'room',
    'one_Rk',
    'two_RK',
    'one_BHK',
    'two_BHK',
    'three_BHK',
    'four_BHK',
    'five_BHK',
] as const;

enum wordNumberMapping {
    'one' = 1,
    'two' = 2,
    'three' = 3,
    'four' = 4,
    'five' = 5,
    'six' = 6,
    'seven' = 7,
    'eight' = 8,
    'nine' = 9,
    'ten' = 10,
}

enum numberSharingTypeMapping {
    'single' = 1,
    'double' = 2,
    'triple' = 3,
}

function getSpaceTypeOptions() {
    const [room, ...rest] = SpaceType;
    const spaceTypes = rest.map((unit) => {
        const [digit, type] = unit.split('_');
        // a cleaver use of enums
        return {
            value: `${wordNumberMapping[digit as unknown as number]} ${type}`,
            key: unit,
        };
    });
    return [{ value: room, key: room }, ...spaceTypes];
}

function getSharingTypeOptions() {
    const emptyArray = createEmptyArray(10);
    return emptyArray.map((index) => {
        if (index + 1 < 4) {
            return {
                key: index + 1,
                value: `${numberSharingTypeMapping[index + 1]} sharing`,
            };
        }
        return {
            key: index + 1,
            value: `${wordNumberMapping[index + 1]} sharing`,
        };
    });
}

const formSchema = z.object({
    name: z.string().min(2, 'name should have at least 2 letter'),
    floor: z.number().min(1),
    spaceType: z.enum(SpaceType, {}),
    rent: z.number().min(1),
    sharingType: z.number().min(1).max(10),
});

export type CreateNewSpaceSchema = z.infer<typeof formSchema>;

const getFloorOptions = (totalFloors: number) => {
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
    const floorOptions = getFloorOptions(totalFloors);
    const modalRef = useRef<HTMLDivElement>(null);
    const onSubmit = handleSubmit((formData) => {
        mutation.mutate(formData);
    });
    const unitTypeOptions = getSpaceTypeOptions();
    const sharingTypeOptions = getSharingTypeOptions();

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
                            id='name'
                            label='Name'
                            placeholder='Enter name for this space?'
                            registerForm={register('name')}
                            type='text'
                        />
                        <div className='flex space-x-2'>
                            <FormSelectBox
                                error={errors.floor?.message}
                                id='floor'
                                label='Floor'
                                options={floorOptions}
                                registerForm={register('floor', {
                                    valueAsNumber: true,
                                })}
                            />
                            <FormSelectBox
                                error={errors.spaceType?.message}
                                id='unit-type'
                                label='Unit Type'
                                options={unitTypeOptions}
                                registerForm={register('spaceType')}
                            />
                        </div>
                        <div className='flex space-x-2'>
                            <FormSelectBox
                                error={errors.sharingType?.message}
                                id='sharing-type'
                                label='Sharing Type'
                                options={sharingTypeOptions}
                                registerForm={register('sharingType', {
                                    valueAsNumber: true,
                                })}
                            />
                            <FormInputBox
                                error={errors.rent?.message}
                                id='rent'
                                label='Room Rent'
                                placeholder='Room Rent'
                                registerForm={register('rent', {
                                    valueAsNumber: true,
                                })}
                                type='numeric'
                            />
                        </div>
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
