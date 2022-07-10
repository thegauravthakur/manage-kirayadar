import { TenantInformationSection } from '../../../../components/TenantInformationSection';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../../../../helpers/userHelper';
import { createEndpoint, postWithToken } from '../../../../helpers/fetchHelper';
import { Response, Space, Tenant } from '../../../../types';

interface SpaceProps {
    space: Space;
    tenants: Tenant[];
}
function Space({ space, tenants }: SpaceProps) {
    return (
        <div className='p-5 space-y-5'>
            <h2 className='text-3xl font-bold'>{space.name}</h2>
            <TenantInformationSection initialTenants={tenants} space={space} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query,
}) => {
    const { spaceId, propertyId } = query;
    const redirect = { redirect: { destination: '/login', permanent: false } };
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (!accessToken) return redirect;
        if (accessToken) {
            const result = await getCurrentUser(accessToken as string);
            if (!result.data?.user) return redirect;
            const spaceResponse = await postWithToken(
                createEndpoint(`space/get/`),
                accessToken as string,
                { propertyId: Number(propertyId) }
            );
            const { data } = (await spaceResponse.json()) as Response<{
                spaces: Space[];
            }>;
            const validSpace = data.spaces.find(
                (space) => space.id === Number(spaceId)
            );
            if (validSpace) {
                const tenantsResponse = await postWithToken(
                    createEndpoint('tenant/get'),
                    accessToken as string,
                    { spaceId: Number(spaceId) }
                );
                const { data } = await tenantsResponse.json();
                return { props: { space: validSpace, tenants: data.tenants } };
            } else return redirect;
        }
    } catch (error) {
        return redirect;
    }
    return { notFound: true };
};

export default Space;
