import { getCurrentUser } from '../helpers/userHelper';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import clsx from 'clsx';
import { SocialLoginButton } from '../components/SocialLoginButton';
import {
    AiOutlineGithub,
    AiOutlineGoogle,
    AiOutlineMail,
} from 'react-icons/ai';
import { useState } from 'react';
import { SignupFormDialog } from '../components/SignupFormDialog';

export default function Signup() {
    const [showDialog, setShowDialog] = useState(false);
    return (
        <div
            className={clsx(
                'h-screen p-2 md:p-5 bg-slate-50',
                'flex flex-col space-y-7'
            )}
        >
            <h1 className={clsx('text-xl font-bold')}>Manage Kirayadar</h1>
            <div className='space-y-7 flex h-full items-center justify-center flex-col'>
                <h2 className={clsx('text-center font-semibold text-xl')}>
                    Create new account
                </h2>
                <SocialLoginButton
                    TrailingWidget={AiOutlineGoogle}
                    isLoading={false}
                    text='Continue with Google'
                    onClick={async () => {}}
                />
                <SocialLoginButton
                    TrailingWidget={AiOutlineGithub}
                    isLoading={false}
                    text='Continue with GitHub'
                    onClick={async () => {}}
                />
                <SocialLoginButton
                    TrailingWidget={AiOutlineMail}
                    isLoading={false}
                    text='Continue with Email'
                    onClick={() => setShowDialog(true)}
                />
                <SignupFormDialog
                    setShowDialog={setShowDialog}
                    showDialog={showDialog}
                />
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (accessToken) {
            const result = await getCurrentUser(accessToken as string);
            if (result.data?.user)
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
        }
    } catch (error) {}

    return { props: {} };
};
