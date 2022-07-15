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

interface TenantViewProp {
    tenant: Tenant;
}
function TenantView({ tenant }: TenantViewProp) {
    return (
        <div className='bg-base-200 min-h-screen flex flex-col'>
            <AppBar />
            <div className='grid grid-cols-[400px_1fr] flex-1 p-5'>
                <div className='space-y-5'>
                    <div className='flex flex-col items-center space-y-5 shadow-md p-8 rounded-xl border bg-base-100'>
                        <Image
                            alt=''
                            className='rounded-full'
                            height={150}
                            src='https://placeimg.com/150/150/people'
                            width={150}
                        />
                        <div className='flex flex-col items-center'>
                            <h2 className='text-2xl font-semibold text-primary'>
                                {tenant.name}
                            </h2>
                            <p className='text-gray-500'>Some Placeholder</p>
                            <p className='text-gray-500'>
                                Some other long placeholder
                            </p>
                        </div>
                        <div className='flex space-x-4'>
                            <button className='btn btn-outline btn-wide max-w-[150px]'>
                                Some
                            </button>
                            <button className='btn btn-primary btn-wide max-w-[150px]'>
                                Text
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col shadow-md rounded-xl border bg-base-100'>
                        <div className='flex items-center justify-between py-5 px-8 border-b'>
                            <div className='flex items-center space-x-2'>
                                <AiOutlinePhone size={25} />
                                <p>Phone Number</p>
                            </div>
                            <p>945984****</p>
                        </div>
                        <div className='flex items-center justify-between py-5 px-8 border-b'>
                            <div className='flex items-center space-x-2'>
                                <AiOutlineMail size={25} />
                                <p>E-Mail</p>
                            </div>
                            <p>{tenant.email}</p>
                        </div>
                        <div className='flex items-center justify-between py-5 px-8 border-b'>
                            <div className='flex items-center space-x-2'>
                                <AiOutlineHome size={25} />
                                <p>Address</p>
                            </div>
                            <p>Kullu, Himachal Pradesh</p>
                        </div>
                        <div className='flex items-center justify-between py-5 px-8 border-b'>
                            <div className='flex items-center space-x-2'>
                                <BsGlobe size={25} />
                                <p>Website</p>
                            </div>
                            <p>https://gauravthakur.in</p>
                        </div>
                    </div>
                </div>
                <div>right</div>
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
