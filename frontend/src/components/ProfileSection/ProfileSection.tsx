import Image from 'next/image';

interface ProfileSectionProps {
    name: string;
}

export function ProfileSection({ name }: ProfileSectionProps) {
    return (
        <div className='flex flex-col items-center space-y-5 shadow-md p-8 rounded-xl border bg-base-100'>
            <Image
                alt=''
                className='rounded-full'
                height={150}
                src='https://placeimg.com/150/150/people'
                width={150}
            />
            <div className='flex flex-col items-center'>
                <h2 className='text-2xl font-semibold text-primary'>{name}</h2>
                <p className='text-gray-500'>Some Placeholder</p>
                <p className='text-gray-500'>Some other long placeholder</p>
            </div>
            <div className='flex space-x-4'>
                <button className='btn btn-outline btn-wide max-w-[150px]'>
                    Message
                </button>
                <button className='btn btn-primary btn-wide max-w-[150px]'>
                    Call
                </button>
            </div>
        </div>
    );
}
