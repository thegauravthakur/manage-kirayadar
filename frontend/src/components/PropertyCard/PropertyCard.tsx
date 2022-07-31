import Link from 'next/link';
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
            <div className='card-body'>
                <div className='flex items-center justify-between'>
                    <h2 className='card-title'>{name}</h2>
                    <span className='text-xs bg-green-600 text-base-100 py-1 px-2 rounded'>
                        {totalTenants}{' '}
                        {pluralize('Tenant', 'Tenants', totalTenants)}
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
