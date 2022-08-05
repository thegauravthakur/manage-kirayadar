import Link from 'next/link';
import { AiOutlineBell } from 'react-icons/ai';
import { ProfileDropdown } from './components/ProfileDropdown';

export function AppBar() {
    return (
        <div className='bg-base-100 px-5 py-2 flex'>
            <div className='flex-1'>
                <Link href='/'>
                    <a className='btn btn-ghost normal-case text-xl text-primary'>
                        Manage Kirayedaar
                    </a>
                </Link>
            </div>
            <a className='btn btn-ghost btn-circle'>
                <div className='indicator'>
                    <AiOutlineBell size={24} />
                    <span className='badge badge-xs badge-secondary indicator-item'></span>
                </div>
            </a>
            <ProfileDropdown />
        </div>
    );
}
