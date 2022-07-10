import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { AddNewPropertyCard } from '../components/AddNewPropertyCard';
import { useProperties } from '../hooks/useProperties';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { PropertyCard } from '../components/PropertyCard';

const Home: NextPage = () => {
    const { properties } = useProperties();
    return (
        <div className='p-5 space-y-5'>
            <h1 className='text-2xl font-semibold'>Manage your properties</h1>
            <div className='flex space-x-6'>
                <AddNewPropertyCard />
                {properties?.slice(0, 2).map(({ id, name, address }) => (
                    <PropertyCard
                        key={id}
                        address={address}
                        id={id}
                        name={name}
                    />
                ))}
                {properties && properties.length > 2 && (
                    <button className='btn btn-circle btn-primary btn-sm btn-outline self-center'>
                        <HiOutlineArrowSmRight fontSize={28} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const redirect = { redirect: { destination: '/login', permanent: false } };
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (!accessToken) return redirect;
        if (accessToken) {
            const result = await getCurrentUser(accessToken as string);
            if (!result.data?.user) return redirect;
        }
    } catch (error) {
        return redirect;
    }
    return { props: {} };
};
