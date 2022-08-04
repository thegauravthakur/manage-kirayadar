import { useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { useSnackbar } from '../../zustand/useSnackbar';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CustomError } from '../../../types';
import { CreateNewPropertySchema } from '../../../components/AddNewPropertyDialog';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';

async function createNewProperty(
    formData: CreateNewPropertySchema,
    token: string
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
const errorMessage = 'Error occurred while fetching all the properties';
export function useCreateNewPropertyMutation(onSuccess: () => void) {
    const queryClient = useQueryClient();
    const { token } = useSession();
    const { show } = useSnackbar();
    const spinner = useGlobalSpinner();
    return useMutation(
        async (formData: CreateNewPropertySchema) => {
            spinner.show();
            return createNewProperty(formData, token!);
        },
        {
            onError: (error: CustomError) => {
                const message = error.errorMessage ?? errorMessage;
                show(message, 'error');
            },
            onSuccess: async () => {
                show('created a new property', 'success');
                // todo: maybe instead of invalidating the cache, we can directly update the cache which will be quick
                await queryClient.invalidateQueries('properties');
                onSuccess();
            },
            onSettled() {
                spinner.hide();
            },
        }
    );
}
