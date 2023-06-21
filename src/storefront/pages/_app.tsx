import RootLayout from "./layout";
import "../styles/globals.scss";
import "keen-slider/keen-slider.min.css";
import { CartProvider } from "@/utils/context/cart";
import { UserProvider } from "@/utils/context/user";
import { CountryProvider } from "@/utils/context/country";
import { RecommenderProvider } from "@/utils/context/recommender";

export default function App({ Component, pageProps }: any) {
  return (
    <CountryProvider>
      <CartProvider>
        <UserProvider>
          <RecommenderProvider>
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </RecommenderProvider>
        </UserProvider>
      </CartProvider>
    </CountryProvider>
  );
}
