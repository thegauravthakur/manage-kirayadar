import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormSelectBoxProps {
    error?: string;
    registerForm?: UseFormRegisterReturn;
    id: string;
    label: string;
    options: { key: string | number; value: string }[];
}

export function FormSelectBox({
    registerForm,
    error,
    label,
    id,
    options,
}: FormSelectBoxProps) {
    return (
        <div className='relative mt-2 w-full'>
            <select
                className={clsx(
                    'border border-black h-14 w-full rounded-lg pl-4 bg-transparent',
                    'outline-none focus:border-blue-700 placeholder-gray-400',
                    {
                        'border-red-600 focus:border-red-600': !!error,
                    }
                )}
                id={id}
                {...registerForm}
            >
                {options.map(({ key, value }) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
            <label
                className='absolute top-[-8px] px-1.5 left-[11px] bg-white text-xs'
                htmlFor='floor'
            >
                {label}
            </label>
            <p className='text-[11px] ml-2 pb-1.5 mt-0.5 text-red-600'>
                {!!error && '*' + error} &#8203;
            </p>
        </div>
    );
}
