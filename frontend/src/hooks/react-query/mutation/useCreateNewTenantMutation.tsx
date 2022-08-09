import { useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CreateNewTenantSchema } from '../../../components/AddNewTenantDialog';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { useSnackbar } from '../../zustand/useSnackbar';
import { CustomError, Space } from '../../../types';

async function addNewTenant(
    formSchema: CreateNewTenantSchema,
    token: string,
    spaceId: number
) {
    const response = await postWithToken(createEndpoint('tenant/add'), token, {
        ...formSchema,
        spaceId,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}

const errorMessage = 'Error occurred while adding a new tenant';
export function useCreateNewTenantMutation(
    space: Space,
    onSuccess: () => void
) {
    const queryClient = useQueryClient();
    const { token } = useSession();
    const globalSpinner = useGlobalSpinner();
    const snackbar = useSnackbar();
    return useMutation(
        async (formData: CreateNewTenantSchema) => {
            globalSpinner.show();
            return addNewTenant(formData, token!, space.id);
        },
        {
            onSuccess: async () => {
                snackbar.show('New Tenant Created Successfully!', 'success');
                const tenantQuery = queryClient.invalidateQueries([
                    'tenants',
                    space.id,
                ]);
                const spaceQuery = queryClient.invalidateQueries([
                    space.propertyId,
                    'spaces',
                    space.id,
                ]);
                await Promise.all([tenantQuery, spaceQuery]);
                onSuccess();
            },
            onSettled() {
                globalSpinner.hide();
            },
            onError(error: CustomError) {
                const message = error.errorMessage ?? errorMessage;
                snackbar.show(message, 'error');
            },
        }
    );
}
