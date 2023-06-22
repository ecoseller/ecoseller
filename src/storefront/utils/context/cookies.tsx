// Cookies
// @ts-ignore
import Cookies from "js-cookie";
import React, { useState, useEffect, useContext, useReducer } from "react";

enum ActionsSetCookieState {
  SETOPENDISCLAIMER = "setOpenDisclaimer",
  SETNECCESSARY = "setNeccessary",
  SETPREFERENCE = "setPreference",
  SETSTATISTICAL = "setStatistical",
  SETADS = "setAds",
}

interface ISetCookieState {
  neccessaryCookies?: boolean;
  preferenceCookies?: boolean;
  statisticalCookies?: boolean;
  adsCookies?: boolean;
  openDisclaimer?: boolean;
}

interface ISetCookieStateAction {
  type: ActionsSetCookieState;
  payload: ISetCookieState;
}

const setCookieStateReducer = (
  state: ISetCookieState,
  action: ISetCookieStateAction
): ISetCookieState => {
  switch (action.type) {
    case ActionsSetCookieState.SETNECCESSARY:
      return {
        ...state,
        neccessaryCookies: action.payload.neccessaryCookies,
      };
    case ActionsSetCookieState.SETPREFERENCE:
      return {
        ...state,
        preferenceCookies: action.payload.preferenceCookies,
      };
    case ActionsSetCookieState.SETSTATISTICAL:
      return {
        ...state,
        statisticalCookies: action.payload.statisticalCookies,
      };

    case ActionsSetCookieState.SETADS:
      return { ...state, adsCookies: action.payload.adsCookies };
    case ActionsSetCookieState.SETOPENDISCLAIMER:
      return { ...state, openDisclaimer: action.payload.openDisclaimer };
    default:
      return state;
  }
};

type ICookieContextProps = {
  cookieState: ISetCookieState;
  setCookieState: (key: string, value: boolean) => void;
  setCookieSettingToCookies: () => void;
  toggleDisclaimer: (val: boolean) => void;
};

const CookieContext = React.createContext<Partial<ICookieContextProps>>({});

interface ICookieProviderProps {
  children: React.ReactNode;
}

const COOKIEPRESET_KEY = "cookiePreset";

export const CookieProvider = ({
  children,
}: ICookieProviderProps): JSX.Element => {
  const [cookieState, dispatchCookieState] = useReducer(setCookieStateReducer, {
    openDisclaimer: false,
    neccessaryCookies: true,
    preferenceCookies: true,
    statisticalCookies: true,
    adsCookies: true,
  });

  const toggleDisclaimer = (value: boolean) => {
    dispatchCookieState({
      type: ActionsSetCookieState.SETOPENDISCLAIMER,
      payload: {
        openDisclaimer: value,
      },
    });
  };

  const getCookieSetting = (key: string): boolean => {
    const cookieSettings = Cookies.get(COOKIEPRESET_KEY) || "{}";
    try {
      const cookieJsonSettings = JSON.parse(cookieSettings);
      return Boolean(cookieJsonSettings[key]);
    } catch {
      return false;
    }
  };

  const setCookieState = (key: string, value: boolean): void => {
    switch (key) {
      case "PREFERENCE":
        dispatchCookieState({
          type: ActionsSetCookieState.SETPREFERENCE,
          payload: {
            preferenceCookies: value,
          },
        });
        break;
      case "STATISTICAL":
        dispatchCookieState({
          type: ActionsSetCookieState.SETSTATISTICAL,
          payload: {
            statisticalCookies: value,
          },
        });
        break;
      case "ADS":
        dispatchCookieState({
          type: ActionsSetCookieState.SETADS,
          payload: {
            adsCookies: value,
          },
        });
        break;
      default:
        break;
    }
  };

  const setCookieSettingToCookies = (allTrue: boolean = false): void => {
    const settings = {
      PREFERENCE: !allTrue ? cookieState.preferenceCookies || false : true,
      STATISTICAL: !allTrue ? cookieState.statisticalCookies || false : true,
      ADS: !allTrue ? cookieState.adsCookies || false : true,
    };
    const stringSettings = JSON.stringify(settings);
    Cookies.set(COOKIEPRESET_KEY, stringSettings, { path: "/" });
  };

  useEffect(() => {
    if (!Cookies.get(COOKIEPRESET_KEY)) {
      dispatchCookieState({
        type: ActionsSetCookieState.SETOPENDISCLAIMER,
        payload: {
          openDisclaimer: true,
        },
      });
    } else {
      dispatchCookieState({
        type: ActionsSetCookieState.SETOPENDISCLAIMER,
        payload: {
          openDisclaimer: false,
        },
      });
      // neccassary are always true

      // load data from cookies
      dispatchCookieState({
        type: ActionsSetCookieState.SETPREFERENCE,
        payload: {
          preferenceCookies: getCookieSetting("PREFERENCE"),
        },
      });

      dispatchCookieState({
        type: ActionsSetCookieState.SETSTATISTICAL,
        payload: {
          statisticalCookies: getCookieSetting("STATISTICAL"),
        },
      });

      dispatchCookieState({
        type: ActionsSetCookieState.SETADS,
        payload: {
          adsCookies: getCookieSetting("ADS"),
        },
      });
    }
  }, []);

  const value = {
    cookieState,
    setCookieState,
    setCookieSettingToCookies,
    toggleDisclaimer,
  };

  return (
    <CookieContext.Provider value={value}>{children}</CookieContext.Provider>
  );
};

export const useCookie = (): any => useContext(CookieContext);
