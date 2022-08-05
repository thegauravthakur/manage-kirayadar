import { useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CreateNewTenantSchema } from '../../../components/AddNewTenantDialog';

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

export function useCreateNewTenantMutation(
    spaceId: number,
    onSuccess: () => void
) {
    const queryClient = useQueryClient();
    const { token } = useSession();
    return useMutation(
        async (formData: CreateNewTenantSchema) => {
            await addNewTenant(formData, token!, spaceId);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['tenants', spaceId]);
                onSuccess();
            },
        }
    );
}
