import { IconType } from 'react-icons';

interface QuickInformationItemProps {
    Icon: IconType;
    tileType: string;
    value: string;
}
export function QuickInformationItem({
    tileType,
    Icon,
    value,
}: QuickInformationItemProps) {
    return (
        <div className='flex items-center justify-between py-5 px-8 border-b'>
            <div className='flex items-center space-x-2'>
                <Icon size={25} />
                <p>{tileType}</p>
            </div>
            <p className='text-gray-500'>{value}</p>
        </div>
    );
}
