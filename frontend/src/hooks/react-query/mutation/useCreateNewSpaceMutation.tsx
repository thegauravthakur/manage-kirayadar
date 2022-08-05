import { useMutation, useQueryClient } from 'react-query';
import { useSession } from '../../useSession';
import { createEndpoint, postWithToken } from '../../../helpers/fetchHelper';
import { CreateNewSpaceSchema } from '../../../components/AddNewSpaceDialog';

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

export function useCreateNewSpaceMutation(
    propertyId: number,
    onSuccess: () => void
) {
    const queryClient = useQueryClient();
    const { token } = useSession();
    return useMutation(
        (formData: CreateNewSpaceSchema) =>
            createNewSpace(formData, token!, propertyId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['spaces', propertyId]);
                onSuccess();
            },
        }
    );
}
