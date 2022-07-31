export function PropertyCardShimmer() {
    return (
        <div className='card w-full max-w-sm bg-base-100 shadow-xl h-60 animate-pulse'>
            <div className='card-body justify-between'>
                <div className='space-y-4'>
                    <div className='flex justify-between'>
                        <div className='h-6 bg-base-300 w-40 rounded'></div>
                        <div className='h-6 bg-base-300 w-20 rounded'></div>
                    </div>
                    <div className='h-4 bg-base-300 w-60 rounded'></div>
                </div>
                <div className='card-actions justify-end'>
                    <div className='h-12 bg-base-300 w-32 rounded-lg'></div>
                </div>
            </div>
        </div>
    );
}
