import Cookies from "js-cookie";
import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";

interface ICartContextProps {
  cart: any | null;
  hasCart: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (product: any) => void;
  updateCart: (product: any) => void;
}

interface ICartProviderProps {
  children: React.ReactNode;
}

const CartContext = createContext<Partial<ICartContextProps>>({});

export const CartProvider = ({ children }: ICartProviderProps): JSX.Element => {
  const [cart, setCart] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("cartToken") || "";
    setToken(token);
  }, []);

  const addToCart = (product: any) => {
    console.log("addToCart", product);
  };

  console.log("cartToken", token);

  const value = {};

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): any => useContext(CartContext);
