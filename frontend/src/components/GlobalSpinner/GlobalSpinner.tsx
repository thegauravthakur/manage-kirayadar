import { AiOutlineLoading } from 'react-icons/ai';
import { useGlobalSpinner } from '../../hooks/zustand/useGlobalSpinner';

export function GlobalSpinner() {
    const { isVisible } = useGlobalSpinner();
    if (!isVisible) return null;
    return (
        <div className='absolute left-0 right-0 h-full top-0 bg-opacity-50 bg-base-100 flex items-center justify-center z-[99999]'>
            <AiOutlineLoading className='animate-spin text-primary' size={30} />
        </div>
    );
}
