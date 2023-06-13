import RootLayout from "./layout";
import "../styles/globals.scss";
import "keen-slider/keen-slider.min.css";
import { CartProvider } from "@/utils/context/cart";
import { UserProvider } from "@/utils/context/user";
import { CountryProvider } from "@/utils/context/country";

export default function App({ Component, pageProps }: any) {
  return (
    <CountryProvider>
      <CartProvider>
        <UserProvider>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </UserProvider>
      </CartProvider>
    </CountryProvider>
  );
}
