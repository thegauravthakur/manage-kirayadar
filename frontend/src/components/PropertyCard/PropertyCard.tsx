import Link from 'next/link';
import { BsPeople } from 'react-icons/bs';
import { pluralize } from '../../helpers/shared';

interface PropertyCardProps {
    name: string;
    address: string;
    id: number;
    totalTenants: number;
}
export function PropertyCard({
    name,
    address,
    id,
    totalTenants,
}: PropertyCardProps) {
    return (
        <div className='card w-full max-w-sm bg-base-100 shadow-xl h-60'>
            <div className='card-body uppercase p-5 sm:p-7'>
                <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-1'>
                    <h2 className='card-title'>{name}</h2>
                    <span className='text-xs bg-green-600 text-base-100 py-1 px-2 rounded whitespace-nowrap flex items-center'>
                        <BsPeople className='mr-2' size={15} />
                        {totalTenants}{' '}
                        {pluralize('tenant', 'tenants', totalTenants)}
                    </span>
                </div>
                <p className='text-gray-500'>{address}</p>
                <div className='card-actions justify-end'>
                    <Link href={`/property/${id}`}>
                        <a className='btn btn-primary'>manage</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
