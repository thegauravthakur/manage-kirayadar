import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { AddNewPropertyCard } from '../components/AddNewPropertyCard';

const Home: NextPage = () => {
    return (
        <div className='p-5'>
            <AddNewPropertyCard />
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
