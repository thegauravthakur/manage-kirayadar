import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { AddNewPropertyCard } from '../components/AddNewPropertyCard';
import { useSnackbar } from '../hooks/zustand/useSnackbar';

const Home: NextPage = () => {
    const { show } = useSnackbar();
    return (
        <div className='p-5'>
            <AddNewPropertyCard />
            <button
                onClick={() =>
                    show(
                        'You are doing great' + Date.now(),
                        Date.now() % 2 == 0 ? 'error' : 'success'
                    )
                }
            >
                click me
            </button>
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
