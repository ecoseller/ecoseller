import Cookies from "js-cookie";
import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { createCart, getCart } from "@/api/cart/cart";
import { postCartProduct, putCartProduct } from "@/api/cart/product";
import { ICart } from "@/types/cart";

interface ICartContextProps {
  cart: any | null;
  cartSize: number;
  addToCart: (
    sku: string,
    qty: number,
    product: number,
    pricelist: string,
    country: string
  ) => void;
  removeFromCart: (
    sku: string,
    product: number,
    pricelist: string,
    country: string
  ) => void;
  updateCart: (
    sku: string,
    qty: number,
    product: number,
    pricelist: string,
    country: string
  ) => void;
}

interface ICartProviderProps {
  children: React.ReactNode;
}

const CartContext = createContext<Partial<ICartContextProps>>({});
const cartTokenCookie = "cartToken";

export const CartProvider = ({ children }: ICartProviderProps): JSX.Element => {
  // TODO: add types for cart and cart items

  const [cart, setCart] = useState<ICart | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartSize, setCartSize] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get(cartTokenCookie) || "";
    setToken(token);
  }, []);

  useEffect(() => {
    if (!token) {
      setCart(null);
      return;
    }
    Cookies.set(cartTokenCookie, token); // TODO: set expiry date
    refetchCart();
  }, [token]);

  const promisedSetToken = (newToken: string) =>
    new Promise((resolve) => setToken(newToken));

  const calculateCartSize = (cart: any) => {
    if (cart?.cart_items) {
      // calculate cart size from cart items quantity and set it to state so we can use it in the UI to display the cart size
      setCartSize(
        cart.cart_items.reduce(
          (acc: number, item: any) => acc + item.quantity,
          0
        )
      );
      return;
    }
    setCartSize(0);
  };

  const refetchCart = async () => {
    if (!token) {
      return;
    }
    getCart(token).then((data) => {
      setCart(data);
      calculateCartSize(data);
    });
  };

  const addToCart = async (
    sku: string,
    qty: number,
    product: number,
    pricelist: string,
    country: string
  ) => {
    if (!token) {
      // if there is no token, create a new cart and set the token
      const cartToken = await createCart(sku, qty, product, pricelist, country);
      setToken(cartToken.token);

      refetchCart();
      return;
    }
    // check if the product is already in the cart and if so, update the quantity instead of adding a new product to the cart
    const productInCart = cart?.cart_items?.find(
      (product: any) =>
        product.product_variant === sku && product.product.id == product
    );
    if (productInCart) {
      // if the product is already in the cart, update the quantity
      const newQty = productInCart.quantity + qty;
      putCartProduct(token, sku, newQty, product, pricelist, country).then(
        (res) => {
          refetchCart();
        }
      );
    } else {
      // if the product is not in the cart, add it
      postCartProduct(token, sku, qty, product, pricelist, country).then(
        (res) => {
          refetchCart();
        }
      );
    }
  };

  const removeFromCart = async (
    sku: string,
    product: number,
    pricelist: string,
    country: string
  ) => {
    if (!token) {
      return;
    }
    putCartProduct(token, sku, 0, product, pricelist, country).then((res) => {
      refetchCart();
    });
  };

  const updateCart = async (
    sku: string,
    quantity: number,
    product: number,
    pricelist: string,
    country: string
  ) => {
    if (!token) {
      return;
    }
    putCartProduct(token, sku, quantity, product, pricelist, country).then(
      (res) => {
        refetchCart();
      }
    );
  };

  const value = {
    cartSize,
    cart,
    addToCart,
    removeFromCart,
    updateCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): any => useContext(CartContext);
