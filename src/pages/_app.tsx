import type { AppProps } from 'next/app';
// import '@/public/prism.css';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
