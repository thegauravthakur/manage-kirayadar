import { Tenant } from '../../types';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface TenantCardProps {
    tenant: Tenant;
}
export function TenantCard({ tenant }: TenantCardProps) {
    const router = useRouter();
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between bg-base-100'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    {tenant.name}
                </h3>
                <p>{tenant.email}</p>
            </div>
            <Link href={router.asPath + `/tenant/${tenant.id}`}>
                <a className='btn btn-outline btn-primary btn-sm'>Manage</a>
            </Link>
        </div>
    );
}
