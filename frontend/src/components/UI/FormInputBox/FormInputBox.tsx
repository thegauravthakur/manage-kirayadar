import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';

interface InputBoxProps {
    id: string;
    label: string;
    placeholder: string;
    type: HTMLInputElement['type'];
    error?: string;
    registerForm?: UseFormRegisterReturn;
}

export function FormInputBox(props: InputBoxProps) {
    const { type, id, registerForm, error, placeholder, label } = props;
    return (
        <div className='relative mt-2'>
            <input
                className={clsx(
                    'border border-black h-14 w-full rounded-lg pl-4',
                    'outline-none focus:border-blue-700 placeholder-gray-400',
                    { 'border-red-600 focus:border-red-600': !!error }
                )}
                id={id}
                placeholder={placeholder}
                type={type}
                {...registerForm}
            />
            <label
                className='absolute top-[-8px] px-1.5 left-[11px] bg-white text-xs'
                htmlFor={id}
            >
                {label}
            </label>
            <p className='text-[11px] ml-2 pb-1.5 mt-0.5 text-red-600'>
                {!!error && '*' + error} &#8203;
            </p>
        </div>
    );
}
