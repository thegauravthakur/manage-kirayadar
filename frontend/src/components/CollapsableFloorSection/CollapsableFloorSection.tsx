import { useState } from 'react';
import clsx from 'clsx';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { SpaceCard } from './components/SpaceCard';

export function CollapsableFloorSection() {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <div className={clsx('space-y-5')}>
            <button
                className='btn btn-outline btn-primary gap-3'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                First Floor
                {isExpanded ? (
                    <BiChevronDown size={22} />
                ) : (
                    <BiChevronUp size={22} />
                )}
            </button>
            {isExpanded && (
                <div className={clsx('grid grid-cols-2 gap-5 p-0')}>
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                    <SpaceCard />
                </div>
            )}
        </div>
    );
}
