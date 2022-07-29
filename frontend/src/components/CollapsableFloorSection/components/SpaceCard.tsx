import { Space } from '../../../types';
import { numberToWord } from '../../../helpers/pageHelper';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SpaceCardProps {
    space: Space;
}
export function SpaceCard({ space }: SpaceCardProps) {
    const router = useRouter();
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between bg-base-100'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    {space.name}
                </h3>
                <p>{numberToWord(space.floor)} floor</p>
            </div>
            <Link href={`${router.asPath}/space/${space.id}`}>
                <a className='btn btn-outline btn-primary btn-sm'>Manage</a>
            </Link>
        </div>
    );
}
