import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/public/prism.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
