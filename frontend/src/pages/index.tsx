import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { useLogout } from '../hooks/useLogout';
import { useQuery } from 'react-query';
import { useSession } from '../hooks/useSession';

const Home: NextPage = () => {
    const mutation = useLogout();
    const { session } = useSession();
    return (
        <div>
            <h1>Welcome {session?.user.name}</h1>
            <h2>Your email is {session?.user.email}</h2>
            <button onClick={() => mutation.mutate()}>logout</button>
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
