import { useLogout } from '../../../hooks/useLogout';
import Image from 'next/image';

export function ProfileDropdown() {
    const mutation = useLogout();
    return (
        <div className='dropdown dropdown-end'>
            <label className='btn btn-ghost btn-circle avatar' tabIndex={0}>
                <div className='w-10 rounded-full'>
                    <Image
                        alt=''
                        height={80}
                        src='https://placeimg.com/80/80/people'
                        width={80}
                    />
                </div>
            </label>
            <ul
                className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
                tabIndex={0}
            >
                <li>
                    <a className='justify-between'>
                        Profile
                        <span className='badge'>New</span>
                    </a>
                </li>
                <li>
                    <a>Settings</a>
                </li>
                <li>
                    <button type='button' onClick={() => mutation.mutate()}>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}
