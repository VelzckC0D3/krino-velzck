import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Analytics } from '@vercel/analytics/react';
import { theme } from '../theme';
import { CarsProvider } from '@/context/Cars'; // Import CarsProvider
import Shell from '@/components/AppShell';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <CarsProvider>
        <Shell>
          <Component {...pageProps} />
        </Shell>
      </CarsProvider>
      <Analytics />
    </MantineProvider>
  );
}
