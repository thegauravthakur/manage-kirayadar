export function SpaceCard() {
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    202 - A
                </h3>
                <p>First floor</p>
            </div>
            <button className='btn btn-outline btn-primary btn-sm'>
                Manage
            </button>
        </div>
    );
}
