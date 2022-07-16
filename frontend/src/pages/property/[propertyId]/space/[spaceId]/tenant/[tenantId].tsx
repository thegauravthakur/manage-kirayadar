import { GetServerSideProps } from 'next';
import {
    createEndpoint,
    postWithToken,
} from '../../../../../../helpers/fetchHelper';
import { getCookie } from 'cookies-next';
import { Tenant } from '../../../../../../types';
import { AppBar } from '../../../../../../components/AppBar';
import { ProfileSection } from '../../../../../../components/ProfileSection';
import { QuickInformation } from '../../../../../../components/QuickInformation';
import { DocumentsSection } from '../../../../../../components/DocumentsSection';

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
                <div className='flex'>
                    <div className='grid grid-cols-2 w-full'>
                        <DocumentsSection />
                        <div className='flex items-center justify-center'>
                            <p>coming soon</p>
                        </div>
                    </div>
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
