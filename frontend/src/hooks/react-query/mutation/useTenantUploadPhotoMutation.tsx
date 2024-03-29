import { useRouter } from 'next/router';
import { SnackBarState, useSnackbar } from '../../zustand/useSnackbar';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { CustomError } from '../../../types';
import { updateTenantProfilePhoto } from '../../../helpers/tenantHelper';

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

export function useTenantUploadPhotoMutation() {
    const { tenantId } = useRouter().query as any;
    const snackbar = useSnackbar();
    const queryClient = useQueryClient();
    const { token } = useSession();
    const uploadMutation = useMutation(
        (file: File) => updateTenantProfilePhoto(token!, file, tenantId),
        {
            onSuccess: async () =>
                onPhotoUpload(snackbar, queryClient, tenantId),
            onError: (e: CustomError) =>
                onPhotoUploadFail(snackbar, e.errorMessage),
        }
    );
    return { uploadMutation };
}
