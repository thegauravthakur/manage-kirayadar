import { GetServerSideProps } from 'next';
import {
    createEndpoint,
    postWithToken,
} from '../../../../../../helpers/fetchHelper';
import { getCookie } from 'cookies-next';
import { Tenant } from '../../../../../../types';
import { AppBar } from '../../../../../../components/AppBar';
import Image from 'next/image';

interface TenantViewProp {
    tenant: Tenant;
}
function TenantView({ tenant }: TenantViewProp) {
    return (
        <div className='bg-base-200 min-h-screen'>
            <AppBar />
            <div className='p-5 my-10 flex space-x-10 max-w-7xl mx-auto'>
                <Image
                    alt=''
                    className='rounded-full'
                    height={200}
                    src='https://placeimg.com/200/200/people'
                    width={200}
                />
                <div className='flex flex-col space-y-2 items-start justify-between'>
                    <div>
                        <h2 className='font-bold text-3xl'>{tenant.name}</h2>
                        <p>{tenant.email}</p>
                    </div>
                    <button className='btn btn-outline'>Contact</button>
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
