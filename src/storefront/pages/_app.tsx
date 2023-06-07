import RootLayout from "./layout";
import "../styles/globals.scss";
import "keen-slider/keen-slider.min.css";
import { CartProvider } from "@/utils/context/cart";

export default function App({ Component, pageProps }: any) {
  return (
    <CartProvider>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </CartProvider>
  );
}
