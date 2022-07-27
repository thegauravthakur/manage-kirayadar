import { AiOutlineEdit } from 'react-icons/ai';
import { useState } from 'react';
import clsx from 'clsx';
import { showFilePicker } from '../DocumentsSection/components/DocumentListItem';
import { fromEvent } from 'file-selector';
import { useMutation, useQuery } from 'react-query';
import { createEndpoint, postWithToken } from '../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { useSnackbar } from '../../hooks/zustand/useSnackbar';
import { CustomError } from '../../types';
import { useSession } from '../../hooks/useSession';
interface ProfileSectionProps {
    name: string;
}

async function updateProfilePhoto(
    token: string,
    handles: unknown,
    propertyId: string,
    spaceId: string,
    tenantId: string
) {
    const [file] = (await fromEvent(handles)) as [File];
    const formData = new FormData();
    formData.append('profilePhoto', file as File);
    formData.append('propertyId', propertyId);
    formData.append('spaceId', spaceId);
    formData.append('tenantId', tenantId);
    const response = await fetch(createEndpoint('tenant/updateProfile'), {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}
async function fetchProfilePhoto(token: string, tenantId: string) {
    const response = await postWithToken(
        createEndpoint('tenant/profilePhoto'),
        token,
        { tenantId }
    );
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
}
function useProfilePicture() {
    const { tenantId } = useRouter().query as Record<string, string>;
    const { session } = useSession();
    const { data: profilePhoto, isLoading } = useQuery(
        ['photo', tenantId],
        async () => fetchProfilePhoto(session.token, tenantId),
        { enabled: !!session.token }
    );
    return { profilePhoto, isLoading };
}

export function ProfileSection({ name }: ProfileSectionProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { tenantId, spaceId, propertyId } = useRouter().query as any;
    const snackbar = useSnackbar();
    const { session } = useSession();
    const uploadMutation = useMutation(
        (handles: unknown) =>
            updateProfilePhoto(
                session.token,
                handles,
                propertyId,
                spaceId,
                tenantId
            ),
        {
            onSuccess: () => snackbar.show('Profile photo updated!', 'success'),
            onError: (e: CustomError) => snackbar.show(e.errorMessage, 'error'),
        }
    );
    const { profilePhoto } = useProfilePicture();
    console.log({ profilePhoto });
    return (
        <div className='flex flex-col items-center space-y-5 shadow-md p-8 rounded-xl border bg-base-100'>
            <div
                className='h-32 w-32 rounded-full flex items-end justify-center overflow-hidden'
                style={{
                    backgroundImage: 'url(https://placeimg.com/150/150/people)',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button
                    className={clsx(
                        'bg-base-200 bg-opacity-80 w-full rounded-b-full text-sm h-10 flex justify-center items-center',
                        'transition-opacity duration-200 ease-in-out',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                    onClick={async () => {
                        const handles = await showFilePicker();
                        uploadMutation.mutate(handles);
                    }}
                >
                    update
                    <AiOutlineEdit size={18} />
                </button>
            </div>
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
