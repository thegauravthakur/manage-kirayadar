import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { logoutUser } from '../../../helpers/userHelper';
import { useSnackbar } from '../../zustand/useSnackbar';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { CustomError } from '../../../types';

const failedLogoutMessage = 'Failed while logging out!';
export const useLogoutMutation = () => {
    const router = useRouter();
    const snackbar = useSnackbar();
    const spinner = useGlobalSpinner();
    return useMutation(
        () => {
            spinner.show();
            return logoutUser();
        },
        {
            onSuccess() {
                snackbar.show('User logged out successfully!', 'success');
                return router.push('/login');
            },
            onError(error: CustomError) {
                const message = error.errorMessage ?? failedLogoutMessage;
                snackbar.show(message, 'error');
            },
            onSettled() {
                spinner.hide();
            },
        }
    );
};
