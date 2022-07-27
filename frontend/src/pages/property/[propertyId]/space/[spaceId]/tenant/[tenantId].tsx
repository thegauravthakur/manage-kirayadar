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
            <div className='p-5 space-y-5'>
                <div className='flex space-x-5'>
                    <ProfileSection name={tenant.name} />
                    <DocumentsSection />
                </div>
                <QuickInformation email={tenant.email} />
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
        if (tenant) return { props: { tenant } };
        else return { notFound: true };
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
