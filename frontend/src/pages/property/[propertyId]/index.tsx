import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import {
    createEndpoint,
    fetchWithToken,
    postWithToken,
} from '../../../helpers/fetchHelper';
import { Property, Response, Space } from '../../../types';
import { AiOutlinePlus } from 'react-icons/ai';
import { CollapsableFloorSection } from '../../../components/CollapsableFloorSection';
import { AddNewSpaceDialog } from '../../../components/AddNewSpaceDialog';
import { useState } from 'react';
import { groupBy } from '../../../helpers/pageHelper';
import { useSpaces } from '../../../hooks/react-query/query/useSpaces';
import { AppBar } from '../../../components/AppBar';
import { CustomHead } from '../../../components/CustomHead';
import { BsArrowLeft } from 'react-icons/bs';
import Link from 'next/link';
import { NoDataToShow } from '../../../components/NoDataToShow/NoDataToShow';

interface DetailedPropertyProps {
    property: Property;
    spaces: Space[];
}

export default function DetailedProperty({
    property,
    spaces: initialSpaces,
}: DetailedPropertyProps) {
    const [showDialog, setShowDialog] = useState(false);
    const { spaces } = useSpaces(property.id, initialSpaces);
    const spacesPerFloor = groupBy(spaces ?? [], (space) => space.floor);
    return (
        <div className='bg-base-200 min-h-screen space-y-5'>
            <CustomHead title={`Manage ${property.name}`} />
            <AppBar />
            <div className='p-5 space-y-5'>
                <Link href='/'>
                    <a className='flex items-center space-x-4 uppercase text-xs text-secondary font-semibold'>
                        <BsArrowLeft size={24} />
                        <span>Back to all properties</span>
                    </a>
                </Link>
                <div className='space-y-5 ml-0 sm:ml-10'>
                    <h1 className='text-2xl font-semibold'>{property.name}</h1>
                    <button
                        className='btn btn-primary btn-48 gap-2'
                        onClick={() => setShowDialog(true)}
                    >
                        <AiOutlinePlus size={22} />
                        Add New Space
                    </button>
                    {Object.keys(spacesPerFloor).map((value) => {
                        return (
                            <CollapsableFloorSection
                                key={value}
                                floor={Number(value)}
                                spaces={spacesPerFloor[value]}
                            />
                        );
                    })}
                    {Object.keys(spacesPerFloor).length === 0 && (
                        <NoDataToShow
                            containerStyles='pt-10'
                            heading='No spaces to show'
                            subHeading='Please create a new space to continue...'
                        />
                    )}
                    <AddNewSpaceDialog
                        propertyId={property.id}
                        setShowDialog={setShowDialog}
                        showDialog={showDialog}
                        totalFloors={property.totalFloors}
                    />
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query: { propertyId },
}) => {
    try {
        const accessToken = getCookie('accessToken', { req, res }) as string;
        const property = await getProperty(accessToken, Number(propertyId));
        if (property) {
            const spaces = await getSpaces(accessToken, property.id);
            return { props: { property, spaces } };
        }
        return { notFound: true };
    } catch (error) {}
    return { notFound: true };
};

async function getProperty(accessToken: string, propertyId: number) {
    const response = await fetchWithToken(
        createEndpoint('property/get'),
        accessToken
    );
    const { data } = (await response.json()) as Response<{
        properties: Property[];
    }>;
    return data.properties.find(({ id }) => id === propertyId);
}

async function getSpaces(accessToken: string, propertyId: number) {
    const allSpacesResponse = await postWithToken(
        createEndpoint('space/get'),
        accessToken as string,
        { propertyId }
    );
    const { data } = await allSpacesResponse.json();
    return data?.spaces;
}
