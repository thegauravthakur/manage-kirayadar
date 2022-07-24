import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                {/*todo: remove this when we have https connection*/}
                <meta
                    content='upgrade-insecure-requests'
                    httpEquiv='Content-Security-Policy'
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
