import { useSnackbar } from '../../zustand/useSnackbar';
import { useRouter } from 'next/router';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { useMutation } from 'react-query';
import { CustomError } from '../../../types';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';
import { LoginFormSchema } from '../../../components/LoginFormDialog/components/LoginForm';

async function loginUser(formData: LoginFormSchema) {
    const response = await postWithData(
        createEndpoint('auth/login?shouldGenerateCookie=true', true),
        formData
    );
    const result: JSONResponse = await response.json();
    if (!response.ok) throw result;
    return result;
}

export function useLoginMutation() {
    const snackbar = useSnackbar();
    const router = useRouter();
    const { show, hide } = useGlobalSpinner();
    return useMutation(
        (formData: LoginFormSchema) => {
            show();
            return loginUser(formData);
        },
        {
            onSuccess: () => router.push('/'),
            onSettled: hide,
            onError(error: CustomError) {
                if (error.errorMessage)
                    snackbar.show(error.errorMessage, 'error');
            },
        }
    );
}
