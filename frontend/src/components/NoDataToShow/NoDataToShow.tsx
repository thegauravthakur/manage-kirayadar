import Image from 'next/image';
import clsx from 'clsx';

interface NoDataToShowProps {
    heading: string;
    subHeading: string;
    containerStyles?: string;
}
export function NoDataToShow({
    heading,
    subHeading,
    containerStyles,
}: NoDataToShowProps) {
    return (
        <div className={clsx('text-center space-y-4', containerStyles)}>
            <Image
                alt='No data to show'
                height={233}
                src='/images/no-data.svg'
                width={700}
            />
            <p className='text-xl uppercase font-bold text-primary'>
                {heading}
            </p>
            <p>{subHeading}</p>
        </div>
    );
}
