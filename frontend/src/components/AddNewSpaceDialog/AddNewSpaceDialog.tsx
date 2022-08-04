import { Dispatch, SetStateAction, useRef } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from 'react-query';
import { AiOutlineClose } from 'react-icons/ai';
import { createEmptyArray, numberToWord } from '../../helpers/pageHelper';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { useSession } from '../../hooks/useSession';
import { FormInputBox } from '../UI/FormInputBox';
import Select, { components } from 'react-select';
import { val } from 'dom7';

const formSchema = z.object({
    name: z.string().min(2, 'name should have at least 2 letter'),
    floor: z.number().min(1, ''),
});

type FormSchema = z.infer<typeof formSchema>;

interface AddNewSpaceDialogProps {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    totalFloors: number;
    propertyId: number;
}

async function createNewSpace(
    formData: FormSchema,
    token: string,
    propertyId: number
) {
    await postWithToken(createEndpoint('space/add'), token, {
        ...formData,
        propertyId,
    });
}

// function SelectContainer({ errors, ...rest }: any) {
//     const { children, ...r } = rest;
//     return (
//         <div className='relative mt-2'>
//             <input
//                 {...r}
//                 className={clsx(
//                     'border border-black h-14 w-full rounded-lg pl-4',
//                     'outline-none focus:border-blue-700 placeholder-gray-400',
//                     {
//                         'border-red-600 focus:border-red-600':
//                             !!errors.floor?.message,
//                     }
//                 )}
//                 id='floor'
//                 placeholder='floor'
//                 type='text'
//             />
//             <label
//                 className='absolute top-[-8px] px-1.5 left-[11px] bg-white text-xs'
//                 htmlFor='floor'
//             >
//                 Select Floor
//             </label>
//             <p className='text-[11px] ml-2 pb-1.5 mt-0.5 text-red-600'>
//                 {!!errors.floor?.message && '*' + errors.floor.message} &#8203;
//             </p>
//         </div>
//     );
// }

const SelectContainer = ({ children, ...props }: any) => {
    return (
        <components.SelectContainer {...props} className=''>
            {children}
            <label className='absolute top-[-8px] px-1.5 left-[11px] bg-white text-xs'>
                Floor
            </label>
        </components.SelectContainer>
    );
};

export function AddNewSpaceDialog({
    showDialog,
    setShowDialog,
    totalFloors,
    propertyId,
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
    const { token } = useSession();
    const queryClient = useQueryClient();
    const mutation = useMutation(
        async (formData: FormSchema) => {
            await createNewSpace(formData, token!, propertyId);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['spaces', propertyId]);
                reset();
                setShowDialog(false);
            },
        }
    );
    const onSubmit = handleSubmit((formData) => {
        mutation.mutate(formData);
    });
    const options = emptyArray.map((value) => ({
        label: numberToWord(value + 1) + ' floor',
        value: numberToWord(value + 1) + ' floor',
    }));
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={ref}
            className={clsx('modal', {
                'modal-open': showDialog,
            })}
        >
            <form className='modal-box space-y-5' onSubmit={onSubmit}>
                <div>
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

                    <Select
                        components={{
                            SelectContainer,
                        }}
                        menuPortalTarget={ref.current}
                        options={options}
                        styles={{
                            control: () => ({
                                border: '1px solid black',
                                cursor: 'pointer',
                                padding: '8px 0 8px 12px',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                ':focus-within': {
                                    borderColor: 'rgb(29 78 216)',
                                },
                            }),
                        }}
                        onChange={(v) => console.log(v)}
                    />
                    {/*<FormLabel*/}
                    {/*    errorText={errors.floor?.message}*/}
                    {/*    id='floor'*/}
                    {/*    labelText='What floor is this space on?'*/}
                    {/*>*/}
                    {/*    <select*/}
                    {/*        className={clsx(*/}
                    {/*            'select select-primary font-normal w-full',*/}
                    {/*            {*/}
                    {/*                'select-error': !!errors.floor,*/}
                    {/*            }*/}
                    {/*        )}*/}
                    {/*        defaultValue={1}*/}
                    {/*        {...register('floor', { valueAsNumber: true })}*/}
                    {/*    >*/}
                    {/*        {emptyArray.map((value) => (*/}
                    {/*            <option key={value} value={value + 1}>*/}
                    {/*                {numberToWord(value + 1)} floor*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}
                    {/*</FormLabel>*/}
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
    );
}
