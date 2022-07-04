import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../../helpers/userHelper';
import { createEndpoint, fetchWithToken } from '../../helpers/fetchHelper';
import { Property, Response } from '../../types';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useState } from 'react';
import clsx from 'clsx';

interface DetailedPropertyProps {
    property: Property;
}

function SpaceCard() {
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    202 - A
                </h3>
                <p>First floor</p>
            </div>
            <button className='btn btn-outline btn-primary btn-sm'>
                Manage
            </button>
        </div>
    );
}

function CollapsableFloor() {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <div className={clsx('space-y-5')}>
            <button
                className='btn btn-outline btn-primary gap-3'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                First Floor
                {isExpanded ? (
                    <BiChevronDown size={22} />
                ) : (
                    <BiChevronUp size={22} />
                )}
            </button>
            {isExpanded && (
                <div className={clsx('grid grid-cols-2 gap-5 p-0')}>
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                </div>
            )}
        </div>
    );
}
export default function DetailedProperty({ property }: DetailedPropertyProps) {
    return (
        <div className='p-5 space-y-5'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-semibold'>{property.name}</h1>
                <button className='btn btn-primary btn-wide gap-2'>
                    <AiOutlinePlus size={22} />
                    Add New Space
                </button>
            </div>
            <CollapsableFloor />
            <CollapsableFloor />
            <CollapsableFloor />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query,
}) => {
    const { id: propertyId } = query;
    const redirect = { redirect: { destination: '/login', permanent: false } };
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (!accessToken) return redirect;
        if (accessToken) {
            const result = await getCurrentUser(accessToken as string);
            if (!result.data?.user) return redirect;
            const response = await fetchWithToken(
                createEndpoint('property/get'),
                accessToken as string
            );
            const { data } = (await response.json()) as Response<{
                properties: Property[];
            }>;
            const property = data.properties.find(
                ({ id }) => Number(id) === Number(propertyId)
            );
            if (property) {
                return { props: { property } };
            }
            return { notFound: true };
        }
    } catch (error) {
        return redirect;
    }
    return { notFound: true };
};
