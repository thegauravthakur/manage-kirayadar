import clsx from 'clsx';

export function PropertyCardShimmer() {
    return (
        <div
            className={clsx(
                'h-60 bg-base-100 inline-block w-full max-w-xs p-6 rounded-lg flex flex-col justify-between shadow-lg m-0.5',
                'transition transition-shadow duration-300 hover:shadow-xl outline-blue-600',
                'animate-pulse'
            )}
        >
            <div className='space-y-4'>
                <div className='flex justify-between'>
                    <div className='h-5 bg-base-300 w-20 rounded'></div>
                    <div className='h-5 bg-base-300 w-20 rounded'></div>
                </div>
                <div className='h-5 bg-base-300 w-40 rounded'></div>
            </div>
            <div className='space-y-4'>
                <div className='h-5 bg-base-300 w-20 rounded'></div>
                <div className='h-5 bg-base-300 w-40 rounded'></div>
            </div>
        </div>
    );
}
