import { AiOutlineEdit } from 'react-icons/ai';
import { useState } from 'react';
import clsx from 'clsx';
import { showFilePicker } from '../DocumentsSection/components/DocumentListItem';
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';
import {
    fetchTenantProfilePhoto,
    updateTenantProfilePhoto,
} from '../../helpers/fetchHelper';
import { useRouter } from 'next/router';
import { SnackBarState, useSnackbar } from '../../hooks/zustand/useSnackbar';
import { CustomError } from '../../types';
import { useSession } from '../../hooks/useSession';

interface ProfileSectionProps {
    name: string;
}

function useProfilePicture() {
    const { tenantId } = useRouter().query as Record<string, string>;
    const { session } = useSession();
    const { data: profilePhoto, isLoading } = useQuery(
        ['photo', tenantId],
        async () => {
            return fetchTenantProfilePhoto(session.token, tenantId);
        },
        { enabled: !!session.token }
    );
    return { profilePhoto, isLoading };
}

async function onPhotoUpload(
    snackbar: SnackBarState,
    queryClient: QueryClient,
    tenantId: string
) {
    snackbar.show('Profile photo updated!', 'success');
    await queryClient.invalidateQueries(['photo', tenantId]);
}

function onPhotoUploadFail(snackbar: SnackBarState, message: string) {
    snackbar.show(message, 'error');
}

function useUploadPhotoMutation() {
    const { tenantId } = useRouter().query as any;
    const snackbar = useSnackbar();
    const queryClient = useQueryClient();
    const { session } = useSession();
    const uploadMutation = useMutation(
        (handles: unknown) =>
            updateTenantProfilePhoto(session.token, handles, tenantId),
        {
            onSuccess: async () =>
                onPhotoUpload(snackbar, queryClient, tenantId),
            onError: (e: CustomError) =>
                onPhotoUploadFail(snackbar, e.errorMessage),
        }
    );
    return { uploadMutation };
}

export function ProfileSection({ name }: ProfileSectionProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { profilePhoto } = useProfilePicture();
    const { uploadMutation } = useUploadPhotoMutation();

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
                    Call
                </button>
                <button className='btn btn-primary btn-wide max-w-[150px]'>
                    Update
                </button>
            </div>
        </div>
    );
}
