import { AiOutlineLoading } from 'react-icons/ai';

export function LoadingWrapper() {
    return (
        <div className='absolute left-0 right-0 h-full top-0 bg-opacity-10 bg-base-100 flex items-center justify-center'>
            <AiOutlineLoading className='animate-spin text-primary' size={30} />
        </div>
    );
}
