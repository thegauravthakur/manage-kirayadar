import { useSnackbar } from '../../zustand/useSnackbar';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { UserDetails } from '../../../components/SignupFormDialog';
import { CustomError } from '../../../types';
import {
    createEndpoint,
    JSONResponse,
    postWithData,
} from '../../../helpers/fetchHelper';

async function createUser(userDetails: UserDetails, otp: string) {
    const response = await postWithData(createEndpoint('user/create'), {
        ...userDetails,
        otp,
    });
    const result: JSONResponse = await response.json();
    if (!response.ok) throw result;
    return result;
}

export function useCreateUserMutation(userDetails: UserDetails) {
    const snackbar = useSnackbar();
    const spinner = useGlobalSpinner();
    const router = useRouter();
    return useMutation(
        (otp: string) => {
            spinner.show();
            return createUser(userDetails, otp);
        },
        {
            onSuccess: () => {
                snackbar.show('Account created successfully!', 'success');
                return router.push('/');
            },
            onError(error: CustomError) {
                snackbar.show(error.errorMessage, 'error');
            },
            onSettled() {
                spinner.hide();
            },
        }
    );
}
