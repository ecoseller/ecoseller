// Cookies
// @ts-ignore
import Cookies from "js-cookie";

import { v4 as uuidv4 } from "uuid";

import { useState, createContext, useContext, useEffect } from "react";
import { IProductSliderData } from "@/types/product";

const recommendedProducts: IProductSliderData[] = [
  {
    id: 1,
    title: "Product 1",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 2,
    title: "Product 2",
    price: "$20",
    image: "/images/products/2.jpg",
    url: "/",
  },
  {
    id: 3,
    title: "Product 3",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 4,
    title: "Product 4",
    price: "$20",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 5,
    title: "Product 5",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 6,
    title: "Product 6",
    price: "$20",
    image: "/images/products/1.jpg",
    url: "/",
  },
];

interface IRecommenderContextProps {
  session: string | undefined;
  sendEvent: (event: RS_EVENT, payload: any) => void;
  getRecommendations: (
    event: RS_RECOMMENDATIONS_SITUATIONS,
    payload: any
  ) => Promise<any[]>; // this should be list of products
}

interface IUserProviderProps {
  children: React.ReactNode;
}

const RecommenderContext = createContext<Partial<IRecommenderContextProps>>({});

const RS_SESSION_COOKIE = "rsSession";

export type RS_EVENT =
  | "product_view"
  | "product_add_to_cart"
  | "purchase"
  | "review";
export type RS_RECOMMENDATIONS_SITUATIONS =
  | "product"
  | "cart"
  | "homepage"
  | "category";

export const RecommenderProvider = ({
  children,
}: IUserProviderProps): JSX.Element => {
  const [session, setSession] = useState<string | undefined>(undefined);

  const generateSession = () => uuidv4();
  useEffect(() => {
    if (!session) {
      const rsSession = Cookies.get(RS_SESSION_COOKIE) || generateSession();
      Cookies.set(RS_SESSION_COOKIE, rsSession);
      setSession(rsSession);
    }
  }, []);

  const sendEvent = async (event: RS_EVENT, payload: any) => {
    /**
     * Purpose of this function is to call Core API to send event to Recommender System
     * @param event - event type
     * @param payload - event payload (product_id, category_id, cart_id, etc.)
     */
    // send POST event to Core API
    const data = await fetch(`api/recommender/${event}`, {
      method: "POST",
      body: JSON.stringify({
        session_id: session,
        ...payload,
      }),
    }).then((res) => res.json());
    console.log("data", data);
    return data;
  };

  const getRecommendations = async (
    situation: RS_RECOMMENDATIONS_SITUATIONS,
    payload: any
  ): Promise<any[]> => {
    /**
     * Purpose of this function is to call Core API to get recommendations from Recommender System
     * @param situation - situation type (product, cart)
     * @param payload - event payload (product_id, category_id, cart_id, etc.)
     * @returns list of products
     */

    // TODO: call Core API to get recommendations
    const data = await fetch(
      `api/recommender/${situation}?payload=${JSON.stringify({
        ...payload,
        session_id: session,
      })}`
    ).then((res) => res.json());
    console.log("data", data);

    return recommendedProducts; // <-- this is just a mock
  };

  const value = {
    session,
    sendEvent,
    getRecommendations,
  };

  return (
    <RecommenderContext.Provider value={value}>
      {children}
    </RecommenderContext.Provider>
  );
};

export const useRecommender = (): any => useContext(RecommenderContext);
