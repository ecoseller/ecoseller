// import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
      // <Head>
      //   <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
      //   <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
      //   <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
      //   <link rel="manifest" href="/favicon/site.webmanifest"/>
      //   <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#8d44ac"/>
      //   <link rel="shortcut icon" href="/favicon/favicon.ico"/>
      //   <meta name="msapplication-TileColor" content="#ffffff"/>
      //   <meta name="msapplication-config" content="/favicon/browserconfig.xml"/>
      //   <meta name="theme-color" content="#ffffff"/>
      // </Head>
      <Component {...pageProps} />
  )
  
}
