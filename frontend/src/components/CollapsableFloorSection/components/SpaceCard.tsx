import { Space } from '../../../types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { pluralize } from '../../../helpers/shared';

interface SpaceCardProps {
    space: Space;
}
export function SpaceCard({ space }: SpaceCardProps) {
    const router = useRouter();
    const { name, floor, propertyId, id, totalTenants } = space;
    return (
        <Link href={`/property/${propertyId}/space/${id}`}>
            <a
                className={clsx(
                    'h-60 bg-base-100 inline-block w-full max-w-xs p-6 rounded-lg flex flex-col justify-between shadow-lg m-0.5',
                    'transition transition-shadow duration-300 hover:shadow-xl outline-blue-600'
                )}
            >
                <div className='space-y-2'>
                    <div className='flex justify-between'>
                        <p>Floor No. {floor}</p>
                        <p className='bg-blue-500 text-white px-4 text-xs flex items-center justify-center rounded-md'>
                            {totalTenants}{' '}
                            {pluralize('Tenant', 'Tenants', totalTenants)}
                        </p>
                    </div>
                    <h3 className='text-lg'>{name}</h3>
                </div>
                <div className='space-y-2'>
                    <p>Capacity: 3 Seater</p>
                    <p>Available Beds: NA</p>
                </div>
            </a>
        </Link>
    );
}
