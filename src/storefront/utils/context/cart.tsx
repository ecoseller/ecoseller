import Cookies from "js-cookie";
import { useState, createContext, useContext, useEffect } from "react";
import { createCart, getCart as fetchCart } from "@/api/cart/cart";
import {
  deleteCartProduct,
  postCartProduct,
  putCartProduct,
} from "@/api/cart/product";
import { ICart, ICartItem } from "@/types/cart";

/**
 * Cart context
 */
interface ICartContext {
  /**
   * cart object
   */
  cart: ICart | null;

  /**
   * Number of items in the cart
   */
  cartSize: number;

  /**
   * Function for adding variant to the cart
   * @param sku
   * @param qty
   * @param product
   * @param pricelist
   * @param country
   */
  addToCart: (
    sku: string,
    qty: number,
    product: number,
    pricelist: string,
    country: string
  ) => void;

  /**
   * Function for removing product variant from the cart
   * @param sku
   */
  removeFromCart: (sku: string) => void;

  /**
   * Function for updating count of product variant in the cart
   * @param sku
   * @param qty
   */
  updateQuantity: (sku: string, qty: number) => void;
}

interface ICartProviderProps {
  children: React.ReactNode;
}

const CartContext = createContext<ICartContext>({} as ICartContext);
const cartTokenCookie = "cartToken";

export const CartProvider = ({ children }: ICartProviderProps): JSX.Element => {
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

  const calculateCartSize = (cart: ICart | null) => {
    if (cart?.cart_items) {
      // calculate cart size from cart items quantity and set it to state so we can use it in the UI to display the cart size
      setCartSize(
        cart.cart_items.reduce(
          (acc: number, item: ICartItem) => acc + item.quantity,
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
    const cart = await fetchCart(token);

    setCart(cart);
    calculateCartSize(cart);
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
      putCartProduct(token, sku, newQty).then((res) => {
        refetchCart();
      });
    } else {
      // if the product is not in the cart, add it
      postCartProduct(token, sku, qty, product, pricelist, country).then(
        (res) => {
          refetchCart();
        }
      );
    }
  };

  const removeFromCart = async (sku: string) => {
    if (!token) {
      return;
    }

    await deleteCartProduct(token, sku);
    await refetchCart();
  };

  const updateQuantity = async (sku: string, quantity: number) => {
    if (!token) {
      return;
    }

    await putCartProduct(token, sku, quantity);
    await refetchCart();
  };

  const value = {
    cart,
    cartSize,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
