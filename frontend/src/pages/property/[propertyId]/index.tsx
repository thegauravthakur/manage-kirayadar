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
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>{property.name}</h1>
                    <button
                        className='btn btn-primary btn-wide gap-2'
                        onClick={() => setShowDialog(true)}
                    >
                        <AiOutlinePlus size={22} />
                        Add New Space
                    </button>
                </div>
                {Object.keys(spacesPerFloor).map((value) => {
                    return (
                        <CollapsableFloorSection
                            key={value}
                            floor={Number(value)}
                            spaces={spacesPerFloor[value]}
                        />
                    );
                })}
                <div>
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
        if (accessToken) {
            const property = await getProperty(accessToken, Number(propertyId));
            if (property) {
                const spaces = await getSpaces(accessToken, property.id);
                return { props: { property, spaces } };
            }
            return { notFound: true };
        }
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
