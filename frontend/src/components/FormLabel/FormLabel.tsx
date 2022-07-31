import { ReactNode } from 'react';

interface FormLabelProps {
    id: string;
    labelText: string;
    children: ReactNode;
    errorText?: string;
}

export function FormLabel({
    id,
    labelText,
    children,
    errorText,
}: FormLabelProps) {
    return (
        <div>
            <label className='label' htmlFor={id}>
                <span className='label-text'>{labelText}</span>
            </label>
            {children}
            {!!errorText && (
                <span className='text-error text-xs pl-2'>{errorText}</span>
            )}
        </div>
    );
}
