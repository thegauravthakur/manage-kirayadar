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
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import { NoDataToShow } from '../../../../../components/NoDataToShow/NoDataToShow';
import { useTenants } from '../../../../../hooks/react-query/query/useTenants';
import { captureException } from '@sentry/nextjs';

interface SpaceProps {
    space: Space;
    tenants: Tenant[];
}
function Space({ space, tenants: initialTenants }: SpaceProps) {
    const { tenants } = useTenants(space.id, initialTenants);
    return (
        <div className='bg-base-200 min-h-screen space-y-5'>
            <CustomHead title={`Manage ${space.name}`} />
            <AppBar />
            <div className='p-5 space-y-5'>
                <Link href={`/property/${space.propertyId}`}>
                    <a className='flex items-center space-x-4 uppercase text-xs text-secondary font-semibold'>
                        <BsArrowLeft size={24} />
                        <span>Back to all spaces</span>
                    </a>
                </Link>
                <div className='space-y-5 ml-0 sm:ml-10'>
                    <h2 className='text-2xl font-semibold'>
                        Room: {space.name}
                    </h2>
                    <TenantInformationSection
                        space={space}
                        tenants={tenants!}
                    />
                    {tenants?.length === 0 && (
                        <NoDataToShow
                            containerStyles='mt-10'
                            heading='no tenants in this space'
                            subHeading='Please create a new tenant to continue...'
                        />
                    )}
                </div>
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
    } catch (error) {
        captureException(error);
    }
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
