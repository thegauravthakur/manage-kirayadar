import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../../helpers/userHelper';
import {
    createEndpoint,
    fetchWithToken,
    postWithToken,
} from '../../helpers/fetchHelper';
import { Property, Response, Space } from '../../types';
import { AiOutlinePlus } from 'react-icons/ai';
import { CollapsableFloorSection } from '../../components/CollapsableFloorSection';
import { AddNewSpaceDialog } from '../../components/AddNewSpaceDialog';
import { useState } from 'react';
import { groupBy } from '../../helpers/pageHelper';

interface DetailedPropertyProps {
    property: Property;
    spaces: Space[];
}

export default function DetailedProperty({
    property,
    spaces,
}: DetailedPropertyProps) {
    const [showDialog, setShowDialog] = useState(false);
    const spacesPerFloor = groupBy(spaces, (space) => space.floor);
    return (
        <div className='p-5 space-y-5'>
            <div className='flex justify-between'>
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
                const allSpacesResponse = await postWithToken(
                    createEndpoint('space/get'),
                    accessToken as string,
                    { propertyId: property.id }
                );
                const { data } = await allSpacesResponse.json();
                return { props: { property, spaces: data?.spaces } };
            }
            return { notFound: true };
        }
    } catch (error) {
        return redirect;
    }
    return { notFound: true };
};
