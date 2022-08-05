import { Tenant } from '../../types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { pluralize } from '../../helpers/shared';

interface TenantCardProps {
    tenant: Tenant;
}
export function TenantCard({ tenant }: TenantCardProps) {
    const router = useRouter();
    const { name, email, id } = tenant;
    return (
        <Link href={router.asPath + `/tenant/${tenant.id}`}>
            <a
                className={clsx(
                    'h-60 bg-base-100 inline-block w-full max-w-xs p-6 rounded-lg flex flex-col justify-between shadow-lg m-0.5',
                    'transition transition-shadow duration-300 hover:shadow-xl outline-blue-600'
                )}
            >
                <div className='space-y-2'>
                    <div className='flex justify-between'>
                        <p>User Id: {id}</p>
                        <p className='bg-blue-500 text-white px-4 text-xs flex items-center justify-center rounded-md'>
                            No Dues
                        </p>
                    </div>
                    <h3 className='text-lg'>{name}</h3>
                </div>
                <div className='space-y-2'>
                    <p>Bed Number: A</p>
                    <p>E-Mail: {email}</p>
                </div>
            </a>
        </Link>
    );
}
