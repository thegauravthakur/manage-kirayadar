import { useMutation, useQueryClient } from 'react-query';
import { Session, useSession } from '../../useSession';
import { useSnackbar } from '../../zustand/useSnackbar';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CustomError } from '../../../types';
import { CreateNewPropertySchema } from '../../../components/AddNewPropertyDialog';

async function createNewProperty(
    formData: CreateNewPropertySchema,
    { token }: Session['session']
) {
    const response = await postWithToken(
        createEndpoint('property/add'),
        token,
        formData
    );
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
}

export function useCreateNewPropertyMutation(
    setShowDialog: (a: boolean) => void
) {
    const queryClient = useQueryClient();
    const { session } = useSession();
    const { show } = useSnackbar();
    return useMutation(
        async (formData: CreateNewPropertySchema) => {
            if (session) return createNewProperty(formData, session);
        },
        {
            onError: (error: CustomError) =>
                show(error.errorMessage ?? '', 'error'),
            onSuccess: async () => {
                show('created a new property', 'success');
                await queryClient.invalidateQueries('properties');
                setShowDialog(false);
            },
        }
    );
}
