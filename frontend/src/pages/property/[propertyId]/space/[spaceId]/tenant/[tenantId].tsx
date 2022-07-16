import { GetServerSideProps } from 'next';
import {
    createEndpoint,
    postWithToken,
} from '../../../../../../helpers/fetchHelper';
import { getCookie } from 'cookies-next';
import { Tenant } from '../../../../../../types';
import { AppBar } from '../../../../../../components/AppBar';
import Image from 'next/image';
import { AiOutlinePhone, AiOutlineMail, AiOutlineHome } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { ProfileSection } from '../../../../../../components/ProfileSection';
import { QuickInformation } from '../../../../../../components/QuickInformation/QuickInformation';

interface TenantViewProp {
    tenant: Tenant;
}
function TenantView({ tenant }: TenantViewProp) {
    return (
        <div className='bg-base-200 min-h-screen flex flex-col'>
            <AppBar />
            <div className='grid grid-cols-[400px_1fr] flex-1 p-5 gap-x-5'>
                <div className='space-y-5'>
                    <ProfileSection name={tenant.name} />
                    <QuickInformation email={tenant.email} />
                </div>
                <div className='flex border items-center justify-center bg-base-100 shadow-md rounded-xl'>
                    <p className='text-center'>coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query: { spaceId, tenantId },
}) => {
    try {
        const accessToken = getCookie('accessToken', { req, res }) as string;
        const tenants = await getTenants(accessToken, Number(spaceId));
        const tenant = tenants.find(
            (value: any) => value.id === Number(tenantId)
        );
        return { props: { tenant } };
    } catch (e) {
        return { notFound: true };
    }
};

async function getTenants(accessToken: string, spaceId: number) {
    const tenantsResponse = await postWithToken(
        createEndpoint('tenant/get'),
        accessToken,
        { spaceId }
    );
    const { data } = await tenantsResponse.json();
    return data.tenants;
}

export default TenantView;
