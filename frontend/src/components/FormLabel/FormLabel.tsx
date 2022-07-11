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
                <label className='label'>
                    <span className='label-text-alt text-error'>
                        {errorText}
                    </span>
                </label>
            )}
        </div>
    );
}
