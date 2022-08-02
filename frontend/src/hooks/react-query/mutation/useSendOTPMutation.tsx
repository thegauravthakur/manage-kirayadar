import { Dispatch, SetStateAction } from 'react';
import { useGlobalSpinner } from '../../zustand/useGlobalSpinner';
import { useSnackbar } from '../../zustand/useSnackbar';
import { useMutation } from 'react-query';
import { UserDetails } from '../../../components/SignupFormDialog';
import { createEndpoint, postWithData } from '../../../helpers/fetchHelper';
import { CustomError } from '../../../types';

export function useSendOTPMutation(
    setFormStep: Dispatch<SetStateAction<number>>
) {
    const globalSpinner = useGlobalSpinner();
    const snackBar = useSnackbar();
    return useMutation(
        async (data: UserDetails) => {
            globalSpinner.show();
            await postWithData(createEndpoint('otp/generate'), {
                email: data.email,
            });
        },
        {
            onSuccess: (data, variables) => {
                setFormStep((step) => step + 1);
                snackBar.show(
                    `OTP sent successfully to ${variables.email}`,
                    'success'
                );
            },
            onError: (error: CustomError) => {
                snackBar.show(error.errorMessage, 'error');
            },
            onSettled: () => {
                globalSpinner.hide();
            },
        }
    );
}
