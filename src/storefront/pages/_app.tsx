import RootLayout from "./layout";
import "../styles/globals.scss";

export default function App({ Component, pageProps }: any) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
