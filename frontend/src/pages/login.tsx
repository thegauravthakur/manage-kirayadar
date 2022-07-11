import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { getCurrentUser } from '../helpers/userHelper';
import {
    AiOutlineGithub,
    AiOutlineGoogle,
    AiOutlineMail,
} from 'react-icons/ai';
import clsx from 'clsx';
import { LoginFormDialog } from '../components/LoginFormDialog';
import { useState } from 'react';

export default function Login() {
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
                    Login to your account
                </h2>
                <button className='btn btn-primary gap-2 w-full max-w-xs'>
                    <AiOutlineGoogle size={24} />
                    Continue with Google
                </button>
                <button className='btn btn-primary gap-2 w-full max-w-xs'>
                    <AiOutlineGithub size={24} />
                    Continue with Github
                </button>
                <button
                    className='btn btn-primary gap-2 w-full max-w-xs'
                    onClick={() => setShowDialog(true)}
                >
                    <AiOutlineMail size={24} />
                    Continue with Email
                </button>
                <div>
                    <LoginFormDialog
                        setShowDialog={setShowDialog}
                        showDialog={showDialog}
                    />
                </div>
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
