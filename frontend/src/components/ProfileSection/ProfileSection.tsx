import { AiOutlineEdit } from 'react-icons/ai';
import { useState } from 'react';
import clsx from 'clsx';
import { useTenantProfilePhoto } from '../../hooks/react-query/query/useTenantProfilePhoto';
import { useTenantUploadPhotoMutation } from '../../hooks/react-query/mutation/useTenantUploadPhotoMutation';

interface ProfileSectionProps {
    name: string;
}

export function ProfileSection({ name }: ProfileSectionProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { profilePhoto } = useTenantProfilePhoto();
    const { uploadMutation } = useTenantUploadPhotoMutation();

    return (
        <div className='flex flex-col items-center space-y-5 shadow-md p-8 rounded-xl border bg-base-100'>
            <div
                className='h-32 w-32 rounded-full flex items-end justify-center overflow-hidden'
                style={{
                    backgroundImage: `url(${profilePhoto})`,
                    backgroundSize: 'cover',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <input
                    hidden
                    accept='image/*'
                    id='chose-file'
                    type='file'
                    onChange={(event) => {
                        if (event.target.files) {
                            const file = event.target.files[0];
                            uploadMutation.mutate(file);
                        }
                    }}
                />
                <label
                    className={clsx(
                        'bg-base-200 bg-opacity-80 w-full rounded-b-full text-sm h-10 flex justify-center items-center cursor-pointer',
                        'transition-opacity duration-200 ease-in-out',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                    htmlFor='chose-file'
                >
                    update
                    <AiOutlineEdit size={18} />
                </label>
            </div>
            <div className='flex flex-col items-center'>
                <h2 className='text-2xl font-semibold text-primary'>{name}</h2>
                <p className='text-gray-500'>Some Placeholder</p>
                <p className='text-gray-500'>Some other long placeholder</p>
            </div>
            <div className='flex space-x-4'>
                <button className='btn btn-outline btn-wide max-w-[150px]'>
                    Call
                </button>
                <button className='btn btn-primary btn-wide max-w-[150px]'>
                    Update
                </button>
            </div>
        </div>
    );
}
