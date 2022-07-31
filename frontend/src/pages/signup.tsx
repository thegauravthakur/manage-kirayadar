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
import Link from 'next/link';

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
                    onClick={() => {}}
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
                <span>
                    Already have an account?{' '}
                    <Link href='/login'>
                        <a className='text-green-600 font-bold'>Login here</a>
                    </Link>
                </span>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const accessToken = getCookie('accessToken', { req, res });
        if (accessToken) {
            const user = await getCurrentUser(accessToken as string);
            if (user)
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
