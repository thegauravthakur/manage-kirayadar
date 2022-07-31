import type { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import { AddNewPropertyCard } from '../components/AddNewPropertyCard';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';
import { AppBar } from '../components/AppBar';
import { CustomHead } from '../components/CustomHead';
import { SwiperSlide, Swiper } from 'swiper/react';
import useMediaQuery from '../hooks/useMediaQuery';
import { PropertyCardShimmer } from '../components/PropertyCard/PropertyCardShimmer';
import { createEmptyArray } from '../helpers/pageHelper';

function useSlidesPerView() {
    // need to look into this in order to make it dynamic
    const _630 = useMediaQuery(`(min-width: 630px)`);
    const _740 = useMediaQuery(`(min-width: 740px)`);
    const _1000 = useMediaQuery(`(min-width: 1000px)`);
    const _1100 = useMediaQuery(`(min-width: 1100px)`);
    const _1400 = useMediaQuery(`(min-width: 1400px)`);
    const _1600 = useMediaQuery(`(min-width: 1600px)`);
    const _1900 = useMediaQuery(`(min-width: 1900px)`);
    if (_1900) return 5.1;
    if (_1600) return 4.1;
    if (_1400) return 3.5;
    if (_1100) return 3.1;
    if (_1000) return 2.5;
    if (_740) return 2.1;
    if (_630) return 1.5;
    return 1.1;
}

const Home: NextPage = () => {
    const { properties, isLoading } = useProperties();
    const emptyArray = createEmptyArray(6);
    const slidesPerView = useSlidesPerView();
    const showNewPropertyCard = useMediaQuery(`(min-width: 860px)`);
    return (
        <div className='bg-base-200 min-h-screen space-y-5 flex flex-col relative'>
            <CustomHead title='Manage Kirayadar' />
            <AppBar />
            <div className='p-5 space-y-5 h-full flex-1 flex flex-col'>
                <h1 className='text-2xl font-semibold'>
                    Manage your properties
                </h1>
                <Swiper
                    className='flex-1 w-full'
                    slidesPerView={slidesPerView}
                    spaceBetween={20}
                >
                    {showNewPropertyCard && (
                        <SwiperSlide>
                            <AddNewPropertyCard />
                        </SwiperSlide>
                    )}
                    {isLoading &&
                        emptyArray.map((value) => (
                            <SwiperSlide key={value}>
                                <PropertyCardShimmer />
                            </SwiperSlide>
                        ))}
                    {properties?.map((property) => (
                        <SwiperSlide key={property.id}>
                            <PropertyCard
                                address={property.address}
                                id={property.id}
                                name={property.name}
                                totalTenants={property.totalTenants}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
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
            const user = await getCurrentUser(accessToken as string);
            if (!user) return redirect;
        }
    } catch (error) {
        return redirect;
    }
    return { props: {} };
};
