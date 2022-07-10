import Link from 'next/link';

export function AppBar() {
    return (
        <div className='bg-base-100 px-5 py-2'>
            <div className='flex-1'>
                <Link href='/'>
                    <a className='btn btn-ghost normal-case text-xl text-primary'>
                        Manage Kirayadar
                    </a>
                </Link>
            </div>
        </div>
    );
}
