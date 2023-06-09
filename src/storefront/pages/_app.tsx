import RootLayout from "./layout";
import "../styles/globals.scss";
import "keen-slider/keen-slider.min.css";
import { CartProvider } from "@/utils/context/cart";
import { CountryProvider } from "@/utils/context/country";

export default function App({ Component, pageProps }: any) {
  return (
    <CountryProvider>
      <CartProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </CartProvider>
    </CountryProvider>
  );
}
