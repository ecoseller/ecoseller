// Cookies
// @ts-ignore
import Cookies from "js-cookie";

import { v4 as uuidv4 } from "uuid";

import { useState, createContext, useContext, useEffect } from "react";
import { IProductSliderData } from "@/types/product";

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

export const RS_SESSION_COOKIE = "rsSession";

export type RS_EVENT =
  | "PRODUCT_DETAIL_ENTER"
  | "PRODUCT_DETAIL_LEAVE"
  | "PRODUCT_ADD_TO_CART"
  | "RECOMMENDATION_VIEW"
  | "ORDER";

export type RS_RECOMMENDATIONS_SITUATIONS =
  | "PRODUCT_DETAIL"
  | "CART"
  | "HOMEPAGE"
  | "CATEGORY_LIST";

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
    const rsSession = Cookies.get(RS_SESSION_COOKIE);
    let new_payload = {
      session_id: rsSession,
      ...payload,
    };
    if (Array.isArray(payload)) {
      new_payload = payload.map((item) => {
        return {
          session_id: rsSession,
          ...item,
        };
      });
    }
    const data = await fetch(`/api/recommender/${event}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: new_payload }),
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

    const rsSession = Cookies.get(RS_SESSION_COOKIE);
    const params = new URLSearchParams({
      ...payload,
      session_id: rsSession,
    }).toString();

    const data = await fetch(
      `/api/recommender/${situation}/products?${params}`
    ).then((res) => res.json());
    console.log("getRecommendations", data);

    return data || []; // <-- this is just a mock
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
