import { TenantInformationSection } from '../../../../../components/TenantInformationSection';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import {
    createEndpoint,
    postWithToken,
} from '../../../../../helpers/fetchHelper';
import { Response, Space, Tenant } from '../../../../../types';
import { AppBar } from '../../../../../components/AppBar';
import { CustomHead } from '../../../../../components/CustomHead';

interface SpaceProps {
    space: Space;
    tenants: Tenant[];
}
function Space({ space, tenants }: SpaceProps) {
    return (
        <div className='bg-base-200 min-h-screen space-y-5'>
            <AppBar />
            <CustomHead title={`Manage ${space.name}`} />
            <div className='p-5 space-y-5'>
                <h2 className='text-3xl font-bold'>{space.name}</h2>
                <TenantInformationSection
                    initialTenants={tenants}
                    space={space}
                />
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query: { spaceId, propertyId },
}) => {
    const redirect = { redirect: { destination: '/', permanent: false } };
    try {
        const accessToken = getCookie('accessToken', { req, res }) as string;
        if (!accessToken) return redirect;
        if (accessToken) {
            const space = await getSpace(
                accessToken,
                Number(propertyId),
                Number(spaceId)
            );
            if (space) {
                const tenants = await getTenants(accessToken, Number(spaceId));
                return { props: { space, tenants } };
            } else return { notFound: true };
        }
    } catch (error) {}
    return { notFound: true };
};

async function getSpace(
    accessToken: string,
    propertyId: number,
    spaceId: number
) {
    const spaceResponse = await postWithToken(
        createEndpoint(`space/get/`),
        accessToken,
        { propertyId }
    );
    const { data } = (await spaceResponse.json()) as Response<{
        spaces: Space[];
    }>;
    return data.spaces.find((space) => space.id === spaceId);
}

async function getTenants(accessToken: string, spaceId: number) {
    const tenantsResponse = await postWithToken(
        createEndpoint('tenant/get'),
        accessToken,
        { spaceId }
    );
    const { data } = await tenantsResponse.json();
    return data.tenants;
}

export default Space;
