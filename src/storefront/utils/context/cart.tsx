import Cookies from "js-cookie";
import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { createCart, getCart } from "@/api/cart/cart";
import { postCartProduct, putCartProduct } from "@/api/cart/product";

interface ICartContextProps {
  cart: any | null;
  cartSize: number;
  addToCart: (sku: string, qty: number) => void;
  removeFromCart: (sku: string, qty: number) => void;
  updateCart: (sku: string, qty: number) => void;
}

interface ICartProviderProps {
  children: React.ReactNode;
}

const CartContext = createContext<Partial<ICartContextProps>>({});

export const CartProvider = ({ children }: ICartProviderProps): JSX.Element => {
  // TODO: add types for cart and cart items

  const [cart, setCart] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartSize, setCartSize] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get("cartToken") || "";
    setToken(token);
  }, []);

  useEffect(() => {
    refetchCart();
  }, [token]);

  useEffect(() => {
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
    console.log("cart", cart, cartSize);
  }, [cart]);

  const initNewCart = async () => {
    createCart()
      .then((res) => res.json())
      .then(async (data) => {
        console.log("createCart", data);
        Cookies.set("cartToken", data.token);
        await setToken(data.token);
      });
  };

  const refetchCart = async () => {
    console.log("refetchCart", token);
    if (!token) {
      return;
    }
    getCart(token)
      .then((res) => res.json())
      .then((data) => {
        console.log("getCart", data);
        setCart(data);
      });
  };

  const addToCart = async (sku: string, qty: number) => {
    if (
      !token ||
      token === "" ||
      token === "null" ||
      token === null ||
      token === "undefined"
    ) {
      // if no token, create a new cart
      await initNewCart();
    }
    // now we should have a token for sure (either from cookie or from new cart) so we can call the add to cart endpoint
    if (!token) {
      console.log("addToCart: no token");
      return;
    }

    // check if the product is already in the cart and if so, update the quantity instead of adding a new product to the cart
    const productInCart = cart?.cart_items?.find(
      (product: any) => product.product_variant === sku
    );
    if (productInCart) {
      // if the product is already in the cart, update the quantity
      const newQty = productInCart.quantity + qty;
      putCartProduct(token, sku, newQty).then((res) => {
        refetchCart();
      });
    } else {
      // if the product is not in the cart, add it
      postCartProduct(token, sku, qty).then((res) => {
        refetchCart();
      });
    }
  };

  const removeFromCart = async (product: any) => {
    if (!token) {
      console.log("removeFromCart: no token");
      return;
    }
    putCartProduct(token, product.product_variant, 0).then((res) => {
      refetchCart();
    });
  };

  const updateCart = async (product: any) => {
    if (!token) {
      console.log("updateCart: no token");
      return;
    }
    putCartProduct(token, product.product_variant, product.quantity).then(
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
