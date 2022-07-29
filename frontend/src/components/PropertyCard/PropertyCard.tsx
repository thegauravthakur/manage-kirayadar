import Link from 'next/link';

interface PropertyCardProps {
    name: string;
    address: string;
    id: number;
}
export function PropertyCard({ name, address, id }: PropertyCardProps) {
    return (
        <div className='card w-full max-w-sm bg-base-100 shadow-xl'>
            <div className='card-body'>
                <h2 className='card-title'>{name}</h2>
                <p className='text-neutral'>{address}</p>
                <div className='card-actions justify-end'>
                    <Link href={`/property/${id}`}>
                        <a className='btn btn-primary'>manage</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
