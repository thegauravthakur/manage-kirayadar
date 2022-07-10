import { Tenant } from '../../types';

interface TenantCardProps {
    tenant: Tenant;
}
export function TenantCard({ tenant }: TenantCardProps) {
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between bg-base-100'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    {tenant.name}
                </h3>
                <p>{tenant.email}</p>
            </div>
            <button className='btn btn-outline btn-primary btn-sm'>
                Manage
            </button>
        </div>
    );
}
