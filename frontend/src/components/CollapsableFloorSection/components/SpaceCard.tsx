import { Space } from '../../../types';
import Link from 'next/link';
import clsx from 'clsx';
import {
    getFormattedShareType,
    getFormattedSpaceType,
} from '../../../helpers/spaceHelper';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const { name, propertyId, id, totalTenants, spaceType, sharingType, rent } =
        space;
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
                        <p>{getFormattedShareType(sharingType)} sharing</p>
                        <p
                            className={clsx(
                                'text-white px-4 text-xs flex items-center justify-center rounded-md',
                                [
                                    totalTenants < sharingType
                                        ? 'bg-blue-500'
                                        : 'bg-red-500',
                                ]
                            )}
                        >
                            {totalTenants < sharingType ? 'vacant' : 'occupied'}
                        </p>
                    </div>
                    <h3 className='text-lg'>Room: {name}</h3>
                </div>
                <div className='space-y-2'>
                    <p>Space Type: {getFormattedSpaceType(spaceType)}</p>
                    <p>Room Rent: &#8377; {rent}</p>
                </div>
            </a>
        </Link>
    );
}
