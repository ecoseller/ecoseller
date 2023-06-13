import Cookies from "js-cookie";
import { useState, createContext, useContext, useEffect } from "react";
import { ICountry } from "@/types/country";
import { getCountries } from "@/api/country";

/**
 * Country context
 */
interface ICountryContext {
  country: ICountry | null;
  countryList: ICountry[];
  setCountryCookieAndLocale: (countryCode: string) => void;
}

interface ICountryProviderProps {
  children: React.ReactNode;
}

const CountryContext = createContext<ICountryContext>({} as ICountryContext);
const countryCookie = "country";

export const CountryProvider = ({
  children,
}: ICountryProviderProps): JSX.Element => {
  /**
   * This country provider / country context is meant to be used for setting and getting the country
   * of the current user based on their cookie preferences.
   * If the user has not set a country, we will default
   */

  const [country, setCountry] = useState<ICountry | null>(null);
  const [countryList, setCountryList] = useState<ICountry[]>([]);

  const fetchCountries = async () => {
    const countries = await getCountries();
    setCountryList(countries);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const countryCookieValue = Cookies.get(countryCookie);
    if (country && countryCookieValue && country.code == countryCookieValue) {
      return;
    }

    if (countryCookieValue && countryList.length > 0) {
      setCountryCookieAndLocale(countryCookieValue);
    } else if (countryList.length > 0) {
      setCountryCookieAndLocale(countryList[0].code);
    }
  }, [countryList]);

  const setCountryCookieAndLocale = (countryCode: string) => {
    const country = countryList.find((country) => country.code === countryCode);
    if (country) {
      // set country state
      setCountry(country);
      // set country cookie
      Cookies.set(countryCookie, country.code);
      // change locale
      Cookies.set("NEXT_LOCALE", country.locale);
    }
  };

  const value = {
    country,
    countryList,
    setCountryCookieAndLocale,
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
