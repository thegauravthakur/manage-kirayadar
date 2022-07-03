import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { AddNewPropertyCard } from '../components/AddNewPropertyCard';
import { useProperties } from '../hooks/useProperties';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import Link from 'next/link';

interface PropertyCardProps {
    name: string;
    address: string;
    id: number;
}
function PropertyCard({ name, address, id }: PropertyCardProps) {
    return (
        <div className='card w-full max-w-sm bg-base-100 shadow-xl'>
            <div className='card-body'>
                <h2 className='card-title'>{name}</h2>
                <p className='text-neutral'>{address}</p>
                <div className='card-actions justify-end'>
                    <Link href={`/property/${id}`}>
                        <a className='btn btn-primary'>manage</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
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
        console.log(accessToken);
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
