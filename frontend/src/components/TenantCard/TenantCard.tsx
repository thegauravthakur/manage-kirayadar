export function TenantCard() {
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    Tenant Name
                </h3>
                <p>Placeholder</p>
            </div>
            <button className='btn btn-outline btn-primary btn-sm'>
                Manage
            </button>
        </div>
    );
}
