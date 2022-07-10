import { TenantCard } from '../TenantCard';
import { AiOutlinePlus } from 'react-icons/ai';
import { AddNewTenantDialog } from '../AddNewTenantDialog';
import { useState } from 'react';

export function TenantInformationSection() {
    const [showModal, setShowModal] = useState(false);
    return (
        <section className='space-y-5'>
            <div className='flex justify-between'>
                <h2 className='text-2xl font-semibold'>
                    Tenants in this space:
                </h2>
                <button
                    className='btn btn-primary btn-wide gap-2'
                    onClick={() => setShowModal(true)}
                >
                    <AiOutlinePlus size={22} />
                    Add New Tenant
                </button>
            </div>
            <div className='grid grid-cols-3 gap-5'>
                <TenantCard />
                <TenantCard />
                <TenantCard />
                <TenantCard />
                <TenantCard />
            </div>
            <div>
                <AddNewTenantDialog
                    setShowDialog={setShowModal}
                    showDialog={showModal}
                />
            </div>
        </section>
    );
}
