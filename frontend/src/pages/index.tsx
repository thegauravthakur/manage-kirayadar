import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { useLogout } from '../hooks/useLogout';
import { useQuery } from 'react-query';
import { useSession } from '../hooks/useSession';
import Image from 'next/image';

const Home: NextPage = () => {
    const mutation = useLogout();
    const { session } = useSession();
    return (
        <div className='p-5'>
            <div className='card w-96 bg-base-100 shadow-xl image-full'>
                <figure>
                    <Image
                        alt='house'
                        height={250}
                        src='https://res.cloudinary.com/gauravthakur/image/upload/v1656783892/Manage%20Kirayadar/house-image_vbvhin.jpg'
                        width={400}
                    />
                </figure>
                <div className='card-body'>
                    <h2 className='card-title'>Register a new property!</h2>
                    <p>
                        Simply register a new property with minutes, and
                        I&apos;ll take care of the rest
                    </p>
                    <div className='card-actions justify-end'>
                        <button className='btn btn-primary btn-md'>
                            Register Now
                        </button>
                    </div>
                </div>
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
