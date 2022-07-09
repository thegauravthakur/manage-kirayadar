import { Space } from '../../../types';
import { numberToWord } from '../../../helpers/pageHelper';

interface SpaceCardProps {
    space: Space;
}
export function SpaceCard({ space }: SpaceCardProps) {
    return (
        <div className='shadow border p-5 rounded-xl flex items-center justify-between'>
            <div>
                <h3 className='text-lg font-semibold text-secondary'>
                    {space.name}
                </h3>
                <p>{numberToWord(space.floor)} floor</p>
            </div>
            <button className='btn btn-outline btn-primary btn-sm'>
                Manage
            </button>
        </div>
    );
}
