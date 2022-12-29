import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css?family=Dosis:300,500,700|Solway:300,700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Dosis:300,500,700|Solway:300,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
