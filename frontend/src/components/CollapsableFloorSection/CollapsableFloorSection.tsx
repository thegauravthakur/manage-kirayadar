import clsx from 'clsx';
import { SpaceCard } from './components/SpaceCard';
import { Space } from '../../types';
import { numberToWord } from '../../helpers/pageHelper';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useSlidesPerView } from '../../pages';

interface CollapsableFloorSectionProps {
    floor: number;
    spaces: Space[];
}
export function CollapsableFloorSection({
    spaces,
    floor,
}: CollapsableFloorSectionProps) {
    const slidesPerView = useSlidesPerView();
    return (
        <div className={clsx('space-y-5 capitalize')}>
            <h3 className='text-lg font-semibold text-primary'>
                {numberToWord(floor)} floor
            </h3>
            <div className={clsx('flex space-x-4')}>
                <Swiper
                    className='flex-1 w-full'
                    slidesPerView={slidesPerView}
                    spaceBetween={20}
                >
                    {spaces.map((space) => (
                        <SwiperSlide key={space.id}>
                            <SpaceCard space={space} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
