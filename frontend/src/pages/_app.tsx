import type { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';
import 'swiper/css';
import { useState } from 'react';
import { Snackbar } from '../components/Snackbar';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <NextNProgress
                    color='#1d4ed8'
                    height={4}
                    options={{ showSpinner: false }}
                />
                <Snackbar />
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>
    );
}

export default MyApp;
