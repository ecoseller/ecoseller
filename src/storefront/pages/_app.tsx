import RootLayout from "./layout";
import "../styles/globals.css";

export default function App({ Component, pageProps }: any) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
