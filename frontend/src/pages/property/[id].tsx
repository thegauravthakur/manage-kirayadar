import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../../helpers/userHelper';
import { createEndpoint, fetchWithToken } from '../../helpers/fetchHelper';
import { Property, Response } from '../../types';
import { AiOutlinePlus } from 'react-icons/ai';
import { CollapsableFloorSection } from '../../components/CollapsableFloorSection';
import { AddNewSpaceDialog } from '../../components/AddNewSpaceDialog';
import { useState } from 'react';

interface DetailedPropertyProps {
    property: Property;
}

export default function DetailedProperty({ property }: DetailedPropertyProps) {
    const [showDialog, setShowDialog] = useState(false);
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
            <CollapsableFloorSection />
            <CollapsableFloorSection />
            <CollapsableFloorSection />
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
                return { props: { property } };
            }
            return { notFound: true };
        }
    } catch (error) {
        return redirect;
    }
    return { notFound: true };
};
