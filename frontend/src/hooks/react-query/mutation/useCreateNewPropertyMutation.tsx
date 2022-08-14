import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from '../../zustand/useSnackbar';
import { createEndpoint, requestWithToken } from '../../../helpers/fetchHelper';
import { CustomError } from '../../../types';
import { CreateNewPropertySchema } from '../../../components/AddNewPropertyDialog';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';

async function createNewProperty(formData: CreateNewPropertySchema) {
    const response = await requestWithToken(
        createEndpoint('property/upsert', true),
        {
            body: formData,
            method: 'POST',
        }
    );
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
}
const errorMessage = 'Error occurred while fetching all the properties';
export function useCreateNewPropertyMutation(onSuccess: () => void) {
    const queryClient = useQueryClient();
    const { show } = useSnackbar();
    const spinner = useGlobalSpinner();
    return useMutation(
        async (formData: CreateNewPropertySchema) => {
            spinner.show();
            return createNewProperty(formData);
        },
        {
            onError: (error: CustomError) => {
                const message = error.errorMessage ?? errorMessage;
                show(message, 'error');
            },
            onSuccess: async () => {
                show('created a new property', 'success');
                await queryClient.invalidateQueries('properties');
                onSuccess();
            },
            onSettled() {
                spinner.hide();
            },
        }
    );
}
