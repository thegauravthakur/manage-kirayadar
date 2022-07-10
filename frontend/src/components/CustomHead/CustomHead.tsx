import Head from 'next/head';

interface CustomHeadProps {
    title: string;
}
export function CustomHead({ title }: CustomHeadProps) {
    return (
        <Head>
            <title>{title}</title>
            <link href='/favicon.ico' rel='shortcut icon' />
        </Head>
    );
}
