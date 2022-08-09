import { Space } from '../../../types';
import Link from 'next/link';
import clsx from 'clsx';
import { RiHotelBedLine, RiHotelBedFill } from 'react-icons/ri';
import { getFormattedSpaceType } from '../../../helpers/spaceHelper';
import { createEmptyArray } from '../../../helpers/pageHelper';
import { pluralize } from '../../../helpers/shared';

interface SpaceCardProps {
    space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const { name, propertyId, id, totalTenants, spaceType, sharingType, rent } =
        space;
    const vacantRooms = sharingType - totalTenants;
    const filledBedsToShow = createEmptyArray(Math.min(totalTenants, 5));
    const emptyBedsToShow = createEmptyArray(
        Math.min(sharingType - totalTenants, 5 - filledBedsToShow.length)
    );
    const extraBeds =
        sharingType - (filledBedsToShow.length + emptyBedsToShow.length);

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
                        <p>Rent: &#8377; {rent}</p>
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
                            {totalTenants < sharingType
                                ? `${vacantRooms} ${pluralize(
                                      'Room',
                                      'Rooms',
                                      vacantRooms
                                  )} vacant`
                                : 'occupied'}
                        </p>
                    </div>
                    <h3 className='text-lg'>Room: {name}</h3>
                </div>
                <div className='space-y-2'>
                    <p>Space Type: {getFormattedSpaceType(spaceType)}</p>
                    <div className='flex items-center space-x-2'>
                        <p>Beds:</p>
                        <div className='flex items-center space-x-2'>
                            {filledBedsToShow.map((key) => (
                                <RiHotelBedFill key={key} size={22} />
                            ))}
                            {emptyBedsToShow.map((key) => (
                                <RiHotelBedLine key={key} size={22} />
                            ))}
                            {extraBeds > 0 && (
                                <p className='text-xs'>+{extraBeds} Beds</p>
                            )}
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
}
