import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { logoutUser } from '../helpers/userHelper';

export const useLogout = () => {
    const router = useRouter();
    return useMutation(() => logoutUser(), {
        onSuccess: () => router.push('/login'),
    });
};
