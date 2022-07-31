import type { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';
import 'swiper/css';
import { useState } from 'react';
import { Snackbar } from '../components/Snackbar';
import NextNProgress from 'nextjs-progressbar';
import { GlobalSpinner } from '../components/GlobalSpinner';

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <NextNProgress
                    color='#4338ca'
                    height={5}
                    options={{ showSpinner: false }}
                />
                <Snackbar />
                <GlobalSpinner />
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>
    );
}

export default MyApp;
