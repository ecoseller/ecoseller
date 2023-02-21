// pages/_app.tsx
import "../styles/globals.scss";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Montserrat, Work_Sans } from "@next/font/google";
import Head from "next/head";

const montserrat = Montserrat({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

const workSans = Work_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#8d44ac"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <style jsx global>
        {`
          :root {
            --font-base: ${workSans.style.fontFamily};
            --font-base-title: ${montserrat.style.fontFamily};
          }
        `}
      </style>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
