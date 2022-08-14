import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';
import { AppBar } from '../components/AppBar';
import { CustomHead } from '../components/CustomHead';
import { SwiperSlide, Swiper } from 'swiper/react';
import useMediaQuery from '../hooks/useMediaQuery';
import { PropertyCardShimmer } from '../components/PropertyCard/PropertyCardShimmer';
import { createEmptyArray } from '../helpers/pageHelper';
import { AddNewPropertyDialog } from '../components/AddNewPropertyDialog';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { NoDataToShow } from '../components/NoDataToShow/NoDataToShow';
import { captureException } from '@sentry/nextjs';

export function useSlidesPerView() {
    // need to look into this in order to make it dynamic
    const _630 = useMediaQuery(`(min-width: 630px)`);
    const _490 = useMediaQuery(`(min-width: 450px)`);
    const _800 = useMediaQuery(`(min-width: 800px)`);
    const _1000 = useMediaQuery(`(min-width: 1000px)`);
    const _1250 = useMediaQuery(`(min-width: 1250px)`);
    const _1350 = useMediaQuery(`(min-width: 1350px)`);
    const _1500 = useMediaQuery(`(min-width: 1500px)`);
    const _1700 = useMediaQuery(`(min-width: 1700px)`);
    if (_1700) return 5.5;
    if (_1500) return 4.5;
    if (_1350) return 4.1;
    if (_1250) return 3.5;
    if (_1000) return 3.1;
    if (_800) return 2.5;
    if (_630) return 2.1;
    if (_490) return 1.5;
    return 1.1;
}

const Home: NextPage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const { properties, isLoading } = useProperties();
    const emptyArray = createEmptyArray(3);
    const slidesPerView = useSlidesPerView();
    return (
        <div className='bg-base-200 min-h-screen space-y-5 flex flex-col relative'>
            <CustomHead title='Manage Kirayadar' />
            <AppBar />
            <div className='p-5 h-full flex-1 flex flex-col space-y-5 md:space-y-7'>
                <h1 className='text-2xl font-semibold'>Your Properties</h1>
                <button
                    className='btn btn-primary w-48'
                    onClick={() => setShowDialog(true)}
                >
                    Create Property
                </button>
                <Swiper
                    className='flex-1 w-full'
                    slidesPerView={slidesPerView}
                    spaceBetween={20}
                >
                    {isLoading &&
                        emptyArray.map((value) => (
                            <SwiperSlide key={value}>
                                <PropertyCardShimmer />
                            </SwiperSlide>
                        ))}
                    {properties?.map((property) => (
                        <SwiperSlide key={property.id}>
                            <PropertyCard property={property} />
                        </SwiperSlide>
                    ))}
                    {properties?.length === 0 && (
                        <NoDataToShow
                            containerStyles='mt-10'
                            heading='no properties to show'
                            subHeading='Please create a new property to continue...'
                        />
                    )}
                </Swiper>
            </div>
            <AddNewPropertyDialog
                setShowDialog={setShowDialog}
                showDialog={showDialog}
            />
        </div>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const redirect = { redirect: { destination: '/login', permanent: false } };
    const queryClient = new QueryClient();
    try {
        const accessToken = getCookie('access_token', { req, res });
        if (!accessToken) return redirect;
        if (accessToken) {
            const user = await getCurrentUser(accessToken as string);
            const tokenQuery = queryClient.prefetchQuery('accessToken', () =>
                Promise.resolve(accessToken)
            );
            const sessionQuery = queryClient.prefetchQuery('session', () =>
                Promise.resolve(user)
            );
            await Promise.all([tokenQuery, sessionQuery]);
            if (!user) return redirect;
        }
    } catch (error) {
        captureException(error);
        return redirect;
    }
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
