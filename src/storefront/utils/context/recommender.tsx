// Cookies
// @ts-ignore
import Cookies from "js-cookie";

import { v4 as uuidv4 } from "uuid";

import { useState, createContext, useContext, useEffect } from "react";
interface IRecommenderContextProps {
  session: string | undefined;
  sendEvent: (event: RS_EVENT, payload: any) => void;
  getRecommendations: (
    event: RS_RECOMMENDATIONS_SITUATIONS,
    payload: any
  ) => any[]; // this should be list of products
}

interface IUserProviderProps {
  children: React.ReactNode;
}

const RecommenderContext = createContext<Partial<IRecommenderContextProps>>({});

const RS_SESSION_COOKIE = "rsSession";

export type RS_EVENT = "view_product" | "add_to_cart" | "purchase";
export type RS_RECOMMENDATIONS_SITUATIONS = "product" | "cart";

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

  const sendEvent = (event: RS_EVENT, payload: any) => {
    /**
     * Purpose of this function is to call Core API to send event to Recommender System
     * @param event - event type
     * @param payload - event payload (product_id, category_id, cart_id, etc.)
     */
  };

  const getRecommendations = (
    situation: RS_RECOMMENDATIONS_SITUATIONS,
    payload: any
  ): any[] => {
    /**
     * Purpose of this function is to call Core API to get recommendations from Recommender System
     * @param situation - situation type (product, cart)
     * @param payload - event payload (product_id, category_id, cart_id, etc.)
     * @returns list of products
     */

    return [];
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
