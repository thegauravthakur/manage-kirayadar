import { AiOutlineHome, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { QuickInformationItem } from './components/QuickInformationItem';

interface QuickInformationProps {
    email: string;
}
export function QuickInformation({ email }: QuickInformationProps) {
    return (
        <div className='flex flex-col shadow-md rounded-xl border bg-base-100 max-w-sm'>
            <QuickInformationItem
                Icon={AiOutlinePhone}
                tileType='Phone Number'
                value='945984****'
            />
            <QuickInformationItem
                Icon={AiOutlineMail}
                tileType='E-Mail'
                value={email}
            />
            <QuickInformationItem
                Icon={AiOutlineHome}
                tileType='Address'
                value='Kullu, Himachal Pradesh'
            />
            <QuickInformationItem
                Icon={BsGlobe}
                tileType='Website'
                value='https://gauravthakur.in'
            />
        </div>
    );
}
