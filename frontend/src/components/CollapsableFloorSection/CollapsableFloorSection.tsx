import { useState } from 'react';
import clsx from 'clsx';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { SpaceCard } from './components/SpaceCard';
import { Space } from '../../types';
import { numberToWord } from '../../helpers/pageHelper';

interface CollapsableFloorSectionProps {
    floor: number;
    spaces: Space[];
}
export function CollapsableFloorSection({
    spaces,
    floor,
}: CollapsableFloorSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <div className={clsx('space-y-5')}>
            <button
                className='btn btn-outline btn-primary gap-3'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {numberToWord(floor)} floor
                {isExpanded ? (
                    <BiChevronDown size={22} />
                ) : (
                    <BiChevronUp size={22} />
                )}
            </button>
            {isExpanded && (
                <div className={clsx('grid grid-cols-2 gap-5 p-0')}>
                    {spaces.map((space) => (
                        <SpaceCard key={space.id} />
                    ))}
                </div>
            )}
        </div>
    );
}
