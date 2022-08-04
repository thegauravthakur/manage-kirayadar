import Link from 'next/link';
import { pluralize } from '../../helpers/shared';
import clsx from 'clsx';
import { Property } from '../../types';
import { useSession } from '../../hooks/useSession';

interface PropertyCardProps {
    property: Property;
}
export function PropertyCard({ property }: PropertyCardProps) {
    const { name, id, totalTenants, totalSpaces, totalFloors } = property;
    const { user } = useSession();
    return (
        <Link href={`/property/${id}`}>
            <a
                className={clsx(
                    'h-60 bg-base-100 inline-block w-full max-w-xs p-6 rounded-lg flex flex-col justify-between shadow-lg m-0.5',
                    'transition transition-shadow duration-300 hover:shadow-xl outline-blue-600'
                )}
            >
                <div className='space-y-2'>
                    <div className='flex justify-between'>
                        <p>
                            {totalSpaces}{' '}
                            {pluralize('Space', 'Spaces', totalSpaces)}
                        </p>
                        <p className='bg-blue-500 text-white px-4 text-xs flex items-center justify-center rounded-md'>
                            {totalTenants}{' '}
                            {pluralize('Tenant', 'Tenants', totalTenants)}
                        </p>
                    </div>
                    <h3 className='text-lg'>{name}</h3>
                </div>
                <div className='space-y-2'>
                    <p>Total Floors: {totalFloors}</p>
                    <p>Owner: {user?.name}</p>
                </div>
            </a>
        </Link>
    );
}
