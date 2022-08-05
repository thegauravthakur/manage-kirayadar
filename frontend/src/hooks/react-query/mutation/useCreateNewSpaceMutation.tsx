import { useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CreateNewSpaceSchema } from '../../../components/AddNewSpaceDialog';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { useSnackbar } from '../../zustand/useSnackbar';
import { CustomError } from '../../../types';

async function createNewSpace(
    formData: CreateNewSpaceSchema,
    token: string,
    propertyId: number
) {
    await postWithToken(createEndpoint('space/add'), token, {
        ...formData,
        propertyId,
    });
}

const errorMessage = 'Error occurred while creating new space!';

export function useCreateNewSpaceMutation(
    propertyId: number,
    onSuccess: () => void
) {
    const queryClient = useQueryClient();
    const { token } = useSession();
    const spinner = useGlobalSpinner();
    const snackbar = useSnackbar();
    return useMutation(
        (formData: CreateNewSpaceSchema) => {
            spinner.show();
            return createNewSpace(formData, token!, propertyId);
        },
        {
            onSuccess: async () => {
                snackbar.show('New Space Created Successfully!', 'success');
                await queryClient.invalidateQueries(['spaces', propertyId]);
                onSuccess();
            },
            onError(error: CustomError) {
                const message = error.errorMessage ?? errorMessage;
                snackbar.show(message, 'error');
            },
            onSettled() {
                spinner.hide();
            },
        }
    );
}
