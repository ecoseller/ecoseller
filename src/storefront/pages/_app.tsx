import RootLayout from "./layout";
import { appWithTranslation } from "next-i18next";
import "../styles/globals.scss";
import "keen-slider/keen-slider.min.css";
import { CartProvider } from "@/utils/context/cart";
import { UserProvider } from "@/utils/context/user";
import { CountryProvider } from "@/utils/context/country";
import { CookieProvider } from "@/utils/context/cookies";

function App({ Component, pageProps }: any) {
  return (
    <CookieProvider>
      <CountryProvider>
        <CartProvider>
          <UserProvider>
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </UserProvider>
        </CartProvider>
      </CountryProvider>
    </CookieProvider>
  );
}

export default appWithTranslation(App);
