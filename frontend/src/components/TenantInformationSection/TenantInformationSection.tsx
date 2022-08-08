import { TenantCard } from '../TenantCard';
import { AiOutlinePlus } from 'react-icons/ai';
import { AddNewTenantDialog } from '../AddNewTenantDialog';
import { useState } from 'react';
import { Space, Tenant } from '../../types';
import { useTenants } from '../../hooks/react-query/query/useTenants';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSlidesPerView } from '../../pages';

interface TenantInformationSectionProps {
    space: Space;
    tenants: Tenant[];
}

export function TenantInformationSection({
    space,
    tenants,
}: TenantInformationSectionProps) {
    const [showModal, setShowModal] = useState(false);
    const slidesPerView = useSlidesPerView();
    return (
        <section className='space-y-5'>
            <h3 className='text-lg font-semibold text-primary'>
                Tenants in this space:
            </h3>
            <button
                className='btn btn-primary btn-48 gap-2'
                onClick={() => setShowModal(true)}
            >
                <AiOutlinePlus size={22} />
                Add New Tenant
            </button>
            <div className={clsx('flex space-x-4')}>
                <Swiper
                    className='flex-1 w-full'
                    slidesPerView={slidesPerView}
                    spaceBetween={20}
                >
                    {tenants?.map((tenant) => (
                        <SwiperSlide key={tenant.id}>
                            <TenantCard tenant={tenant} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <AddNewTenantDialog
                setShowDialog={setShowModal}
                showDialog={showModal}
                spaceId={space.id}
            />
        </section>
    );
}
